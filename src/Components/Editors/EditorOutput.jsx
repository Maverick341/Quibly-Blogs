import Blocks from "editorjs-blocks-react-renderer";
import { CustomCodeRenderer, CustomListRenderer } from "..";

const renderers = {
  code: CustomCodeRenderer,
  list: CustomListRenderer,
};

const config = {
  paragraph: {
    className: "text-xs sm:text-sm leading-6 sm:leading-7 mb-4 sm:mb-6",
  },
  header: {
    className:
      "font-serif font-bold text-[#1a1a1a] dark:text-[#f5f3f0] mt-6 sm:mt-8 mb-3 sm:mb-4",
  },
  list: {
    className: "text-xs sm:text-sm space-y-2 sm:space-y-3",
  },
  quote: {
    className:
      "border-l-4 border-[#a8956b] pl-4 sm:pl-6 italic text-xs sm:text-sm text-[#4a4a4a] dark:text-[#b8b6b3] my-4 sm:my-6",
  },
  code: {
    className: "my-4 sm:my-6",
  },
  table: {
    className: "w-full border-collapse border border-[#d0cdc8] dark:border-[#3a3d41] text-xs sm:text-sm",
  },
  image: {
    className: "my-6 sm:my-8",
    actionsClassNames: {
      stretched: "w-full",
      withBorder: "border border-[#d0cdc8] dark:border-[#3a3d41]",
      withBackground: "p-2 bg-[#f7f5f2] dark:bg-[#26292d]",
    },
  },
  embed: {
    className: "my-6 sm:my-8",
    rel: "noreferrer noopener external",
  },
};

const EditorOutput = ({ content }) => {
  const data = content && content.blocks ? content : { blocks: [] };
  console.log(data);

  return <Blocks data={data} renderers={renderers} config={config} />;
};

export default EditorOutput;
