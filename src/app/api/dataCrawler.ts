import axios from 'axios';
import { load } from 'cheerio';
import dayjs from 'dayjs';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

// const currentYear = dayjs().year();

// const YEAR = [
//   '19xx-2000',
//   ...Array.from({ length: currentYear - 2000 + 1 }, (_, index) => (2000 + index).toString()),
// ];

export const PAGE: number[] = [];

// export const GET = async () => {
//   revalidatePath('/');
//   return NextResponse.json({
//     revalidated: true,
//     now: Date.now(),
//   });
// };

export const scrapePage = async () => {
  const pageList: number[] = [];

  const maxParallelRequests = 5;
  let page = 1;

  const getPageData = async (pageNum: number) => {
    console.log('Fetching page:', pageNum);
    const htmlData = await getPage(pageNum);

    if (!htmlData) {
      return null;
    }

    const $ = load(htmlData);
    const isEmptyPage = $('.list-board > .wr-none').text().trim() === '게시물이 없습니다.';

    if (isEmptyPage) {
      return null;
    }

    return pageNum;
  };

  const promises: Promise<number | null>[] = [];

  while (true) {
    while (promises.length < maxParallelRequests) {
      const promise = getPageData(page);
      promises.push(promise);
      page++;
    }

    const results = await Promise.all(promises);

    for (const result of results) {
      if (result !== null) {
        pageList.push(result);
      }
    }

    promises.length = 0;

    if (results.every(result => result === null)) {
      break;
    }
  }

  if (!PAGE[0]) {
    PAGE.push(...pageList);
  } else {
    PAGE.length = 0;
  }
};

export const getPage = async (PAGE: number) => {
  try {
    const { data } = await axios.get(`https://ohli24.live/bbs/board.php?bo_table=fin&page=${PAGE}`);
    return data;
  } catch (error) {
    console.log(`Error fetching page ${PAGE}`, error);
    return null;
  }
};

export const getAnimeList = async () => {
  const results = [];
  await scrapePage();
  for (const page of PAGE) {
    try {
      const { data } = await axios.get(
        `https://ohli24.live/bbs/board.php?bo_table=fin&page=${page}`,
      );

      const $ = load(data);
      const title = $(
        '.list-row > .list-col > .list-box > .list-front > .list-text > .list-desc > a > .post-title',
      ).text();
      const link = $('.list-row > .list-col > .list-box > .list-front > .list-img > a').attr(
        'href',
      );

      results.push(title);
    } catch (error) {
      console.log(`can't fetching anime list`, error);
    }
  }
  console.log(results, 'go');
  return results;
};
