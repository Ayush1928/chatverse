import { Icons } from "@/Components/Icons";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound } from "next/navigation";

const page = async ({ }) => {

  const session = await getServerSession(authOptions)
  if (!session) notFound()
  
  return <div className="bg-slate-800 h-screen flex items-center justify-center">
    <div className="flex flex-col h-36 justify-center items-center shrink-0">
      <Icons.Logo className="h-28 w-auto text-indigo-700" />
      <h1 className="font-bold text-2xl text-slate-400">Chatverse</h1>
    </div>
  </div>;
};

export default page;
