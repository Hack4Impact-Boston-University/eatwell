import { useRouter } from 'next/router';
import useSWR from 'swr';

const fetcher = async (...args) => {
  const res = await fetch(...args);

  return res.json();
};

function Recipe() {
  const router = useRouter();
  const { name } = router.query;
  const { data } = useSWR(`/api/recipes/${name}`, fetcher);

  if (!data) {
    return 'Loading...';
  }

  return (
    <div>
      <p>Content: {data.ing}</p>
    </div>
  );
}

export default Recipe;
