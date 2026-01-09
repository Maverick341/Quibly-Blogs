import Blocks from "editorjs-blocks-react-renderer";
import { CustomCodeRenderer, CustomListRenderer } from "..";

const renderers = {
  code: CustomCodeRenderer,
  list: CustomListRenderer,
};

const config = {
  paragraph: {
    className: "text-sm sm:text-base leading-7 sm:leading-8 mb-4 sm:mb-6",
  },
  header: {
    className:
      "font-bold text-[#1a1a1a] dark:text-[#f5f3f0] mt-8 sm:mt-10 mb-4 sm:mb-5 text-lg sm:text-2xl",
  },
  list: {
    className: "text-sm sm:text-base space-y-2 sm:space-y-3 -ml-2 sm:-ml-3",
  },
  quote: {
    className:
      "w-full border-l-4 border-[#a8956b] pl-5 sm:pl-8 italic text-sm sm:text-base text-[#4a4a4a] dark:text-[#b8b6b3] my-5 sm:my-7 py-1",
  },
  code: {
    className: "my-4 sm:my-6",
  },
  table: {
    className: "w-full border-collapse border border-[#d0cdc8] dark:border-[#3a3d41] text-xs sm:text-sm",
  },
  image: {
    className: "my-7 sm:my-9",
    actionsClassNames: {
      stretched: "w-full",
      withBorder: "border border-[#d0cdc8] dark:border-[#3a3d41] rounded-md",
      withBackground: "p-3 sm:p-4 bg-[#f7f5f2] dark:bg-[#26292d] rounded-md",
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
