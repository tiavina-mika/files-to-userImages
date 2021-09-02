/** @jsxRuntime classic /
/* @jsx jsx */
import { jsx } from "@emotion/react";
import { filterLayersByType } from "./actions/templates";

// ------------------------------- //
// ------------ files ------------ //
// ------------------------------- //
const files = [
  { file: "/me.jpg" },
  { file: "/le_cri.jpg" },
  { file: "/image1.jpg" },
  { file: "/anatomies.jpeg" }
];

// ------------------------------- //
// ------------ template --------- //
// ------------------------------- //
// const template = {
//   name: "template1",
//   layers: [
//     { id: "m1", type: "mask", layers: [
//       { id: "ui1", type: "userImage" },
//       { id: "ui11", type: "userImage" },
//     ] },
//     { id: "ut1", type: "userText" },
//   ]
// };

const template = {
  name: "template1",
  layers: [
    {
      id: "m1",
      type: "mask",
      layers: [
        // { id: "ui1", type: "userImage" },
        { id: "ui1", type: "userImage" }
      ]
    },
    { id: "ut1", type: "userText" },
    { id: "ui11", type: "userImage" }
  ]
};

const bindFilesToTemplates = (template) => {
  // --------------------------- //
  // -------- copy files ------- //
  // --------------------------- //
  const userImageWithFiles = [];
  // get userImage layers
  const userImages = filterLayersByType(template.layers, "userImage");
  for (let i = 0; i < userImages.length; i++) {
    userImageWithFiles[i] = [...files];
  }

  // --------------------------- //
  // ------------ pack --------- //
  // --------------------------- //
  // each pack should have a template => 4p x 1t x2l
  const newPackTemplates = [];

  new Array(4).fill(0).forEach((_, index) => {
    const newTemplate = {
      ...template
    };
    newPackTemplates.push(newTemplate);
  });

  let indexFile = 0;
  for (let i = 0; i < newPackTemplates.length; i++) {
    const userImages = filterLayersByType(
      newPackTemplates[i].layers,
      "userImage"
    );
    for (let j = 0; j < userImages.length; j++) {
      const file = files[indexFile];
      userImages[j] = { ...userImages[j], file };
      // userImages[j] = file;
      indexFile++;
      if (indexFile === files.length) {
        // files length
        indexFile = 0;
      }
    }

    const layersWithMask = [
      ...newPackTemplates[i].layers.map((l) => {
        if (!l.layers) {
          if (l.type === "userText") {
            return { ...l };
          }
          return {
            ...l,
            ...userImages.find((u) => u.id === l.id)
          };
        }
        return {
          ...l,
          layers: userImages.filter((sb) =>
            l.layers.find((u) => u.id === sb.id)
          )
        };
      })
    ];

    newPackTemplates[i].layers = [...layersWithMask];
    return newPackTemplates;
  }
};

console.log("bindFilesToTemplates", bindFilesToTemplates(template));

const Test = () => {
  return <div className="flexCenter">text</div>;
};

export default Test;
