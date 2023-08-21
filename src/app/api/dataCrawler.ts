import dayjs from 'dayjs';

const currentYear = dayjs().year();

const YEAR = [
  '19xx-2000',
  ...Array.from({ length: currentYear - 2000 + 1 }, (_, index) => (2000 + index).toString()),
];

const getAnimeList = async () => {
  const promise = Object.entries(YEAR).map(async ([index, year]) => {});
};
