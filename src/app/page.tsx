import { CardClientList } from "@/components/CardClientList";
import LoadingCard from "@/components/LodingCard";
import { fetchPosts } from "@/lib/data/fetchPost";


export default function Home() {
  return (
    <div className="flex justify-center items-baseline mx-10">
      {/* <h2>Hello world</h2> */}
      {/* <DashBoardPage/> */}
      {/* <Button variant="destructive">Click me <BadgePlus/></Button> */}
      {/* <Button variant="destructive">
        <Truck/>
        <Trophy/>
      </Button> */}
      {/* <Cards
      id={1}
      body="​Hello World ឆាយ​ ដាវីន"
      title="​​Hello World ឆាយ​ ដាវីន"
      userId={1}
      /> */}

      {/* <CardClientList/> */}
      <CardClientList fetchPosts={fetchPosts()}/>
      {/* <LoadingCard/> */}
      {/* <LoadingCard count={15}/> */}
    </div>
  );
}
