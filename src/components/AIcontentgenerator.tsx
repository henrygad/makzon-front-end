import { Button } from "./Button";
import Dialog from "./Dialog";

type Props = {
    topic: string,
    setTopic: (topic: string) => void,
    loading: boolean,
    handleGenerate: (data: string) => void
    dialog: boolean,
    handleDialog: () => void
}

const AIcontentgenerator = ({ topic, setTopic, loading, dialog, handleDialog, handleGenerate }: Props) => {

    return <>
        <Button
            fieldName={<span className="text-white font-bold">
                Ai post
            </span>}
            className="bg-blue-600 text-white px-4 py-2 rounded-md shadow cursor-pointer"
            onClick={handleDialog}
        />
        <Dialog
            dialog={dialog}
            handleDialog={handleDialog}
            children={
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                       handleGenerate(topic);
                    }}
                    className="flex flex-col gap-4 p-6 shadow-md"
                >
                    <label htmlFor="text-area-contetn">
                        <textarea
                            id="text-area-contetn"
                            className="flex flex-1 min-w-[240px] sm:min-w-[320px] h-auto w-auto border border-slate-300 p-3 rounded-md outline-none resize-none"
                            rows={3}
                            placeholder="What blog topic do you want?"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            autoFocus={true}
                        />
                    </label>
                    <span className="inline-block">
                        <Button
                            fieldName={
                                <span className="text-white font-bold">
                                    {loading ? "Generating..." : "Generate"}
                                </span>
                            }
                            disabled={loading}
                            className="w-full py-2 flex justify-center items-center bg-green-800 rounded-full shadow-sm transition-colors duration-100 active:bg-green-700"                           
                        />
                    </span>
                </form>
            }            
        />
    </>;
};

export default AIcontentgenerator;
