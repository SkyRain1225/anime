import { getAnimeList } from './api/dataCrawler';

const Home = async () => {
  getAnimeList().then(res => console.log(res, 'res'));

  return <div>Hi there</div>;
};

export default Home;
