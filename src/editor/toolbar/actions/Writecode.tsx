import blockCmd from "../../commands/block.cmd";
import { actionsProps } from "../../type";

const Writecode = ({
  getNodesWithinTextEditor,
  handleGlobalChangesOnInputArea
}: actionsProps) => {
  const handleInsertCode = () => {
    blockCmd("code", getNodesWithinTextEditor(), { value: "", style: [] });
    handleGlobalChangesOnInputArea();
  };

  return <div id="embed-code">
    <button className="text-base p-1"
      onClick={() => handleInsertCode()}>
      {"{ }"}
    </button>
  </div>;
};

export default Writecode;
