import { ChevronLeftIcon } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

const TaskPage = () => {
    const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const name = searchParams.get("name");
  const description = searchParams.get("description");
  const onBackHomeClick = () => {
    navigate("/");
  }
  return (
    <div className="w-screen h-screen bg-slate-600 flex justify-center p-6">
      <div className="w-[500px]">
        <div className="flex">
            <button onClick={onBackHomeClick} className="text-slate-200 me-3 cursor-pointer"><ChevronLeftIcon width={40} height={40}/></button>
          <h1 className="text-3xl font-bold text-slate-200 text-center">
            Detalhes da tarefa
          </h1>
        </div>
        <div
          className={`space-y-4 bg-slate-200 rounded-md p-5 mt-5 flex flex-col`}
        >
          <h1 className="text-center text-2xl font-bold text-slate-700">
            {name}
          </h1>
          <p className="text-md font-light">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default TaskPage;
