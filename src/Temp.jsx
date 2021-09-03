/** @jsxRuntime classic /
/* @jsx jsx */
import { jsx } from "@emotion/react";
import ReactJson from "react-json-view";

import { filterLayersByType } from "./actions/templates";

// ------------------------------- //
// ------------ files ------------ //
// ------------------------------- //
const files = [
  { file: "/me.jpg" },
  { file: "/le_cri.jpg" },
  { file: "/image1.jpg" },
  { file: "/anatomies.jpeg" },
  { file: "/me.jpg" },
  { file: "/le_cri.jpg" },
  { file: "/image1.jpg" },
  { file: "/anatomies.jpeg" },
  { file: "/image1.jpg" }
];

// ------------------------------- //
// ------------ template --------- //
// ------------------------------- //

const template = {
  name: "template1",
  layers: [
    {
      id: "m1",
      type: "mask",
      layers: [
        { id: "ui1", type: "userImage" }
        // { id: "ui11", type: "userImage" },
        // { id: "ut1", type: "userText" },
        // { id: "i1", type: "image" }
      ]
    },
    { id: "ut2", type: "userText" }
    // { id: "i2", type: "image" }
    // { id: "ui11", type: "userImage" }
  ]
};

const classes = {
  reactJson: {
    width: "100%",
    padding: 20
  }
};

// --------------------------- //
// ------------ pack --------- //
// --------------------------- //
// each pack should have a template => 4p x 1t x2l
const bindFilesToTemplates = (template, files, pack = 4) => {
  const templatesPack = [];

  new Array(pack).fill(0).forEach(() => {
    templatesPack.push(template);
  });

  let indexFile = 0;
  console.log(indexFile);
  for (let i = 0; i < templatesPack.length; i++) {
    const userImageLayers = filterLayersByType(
      templatesPack[i].layers,
      "userImage"
    );
    for (let j = 0; j < userImageLayers.length; j++) {
      // for (let j = 0; j < userImageLayers.length; j++) {

      const file = files[indexFile];
      console.log(file);

      userImageLayers[j] = { ...userImageLayers[j], file };
      indexFile++;
      if (indexFile === files.length) {
        // files length
        indexFile = 0;
      }
    }

    // console.log(userImageLayers);

    const layersWithMask = [
      ...templatesPack[i].layers.map((layer) => {
        // layers level 1
        if (!layer.layers) {
          if (layer.type === "userText" || layer.type === "image") {
            return { ...layer };
          }
          // userImage layers level 1
          return {
            ...layer,
            ...userImageLayers.find((u) => u.id === layer.id)
          };
        }

        // console.log(userImageLayers)

        // layers level 2
        return {
          ...layer,
          layers: [
            // remove userImages not treated yet
            ...layer.layers.filter((subLayer) => subLayer.type !== "userImage"),
            // userImages with images
            userImageLayers.filter((userImageLayer) =>
              layer.layers.find((subLayer) => subLayer.id === userImageLayer.id)
            )
          ]
        };
      })
    ];

    // templatesPack[i].layers = userImageLayers;
    templatesPack[i].layers = [...layersWithMask];
  }
  // return userImageLayers;
  return templatesPack;
};

console.log("bindFilesToTemplates", bindFilesToTemplates(template, files, 9));

// --------------------------- //
// ------------ component --------- //
// --------------------------- //
const Test = () => {
  return (
    <div className="flexCenter">
      <ReactJson
        src={bindFilesToTemplates(template, files, 9)}
        theme="pop"
        displayDataTypes={false}
        style={classes.reactJson}
      />
    </div>
  );
};

export default Test;
