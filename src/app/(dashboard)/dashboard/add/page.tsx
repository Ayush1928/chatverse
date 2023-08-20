import AddFriendButton from "@/Components/AddFriendButton";

const page = async () => {

  return <main className="flex flex-col justify-center mt-28 md:mt-16 items-center">
    <h1 className="font-bold text-slate-200 text-4xl md:text-5xl mb-8 text-center">Add a Friend</h1>
    <AddFriendButton/>
  </main>;
};

export default page;
