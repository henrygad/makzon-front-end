

const addInitialSpans = (
  inputRef: React.RefObject<HTMLDivElement | null>,
) => {
  /* add first contentEditable div span */
  const first_child_content_editable_input_span =
    document.createElement("span");
  first_child_content_editable_input_span.classList.add("block");

  if (inputRef && inputRef.current) {
    first_child_content_editable_input_span.innerHTML = "<br>";
    inputRef.current.appendChild(first_child_content_editable_input_span); // add initail inputs
    inputRef.current.focus();
  }
};

export default addInitialSpans;
