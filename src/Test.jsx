/** @jsxRuntime classic /
/* @jsx jsx */
import { css, jsx } from "@emotion/react";
import ReactJson from "react-json-view";

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

const template = {
  name: "template1",
  layers: [
    {
      id: "m1",
      type: "mask",
      layers: [
        { id: "ui1", type: "userImage" },
        { id: "ui11", type: "userImage" },
        { id: "ut1", type: "userText" },
        { id: "i1", type: "image" }
      ]
    },
    { id: "ut2", type: "userText" },
    { id: "i2", type: "image" }
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
const bindFilesToTemplates = (template) => {
  const newPackTemplates = [];

  new Array(4).fill(0).forEach((_, index) => {
    const newTemplate = {
      ...template
    };
    newPackTemplates.push(newTemplate);
  });

  let indexFile = 0;
  for (let i = 0; i < newPackTemplates.length; i++) {
    const userImageLayers = filterLayersByType(
      newPackTemplates[i].layers,
      "userImage"
    );
    for (let j = 0; j < userImageLayers.length; j++) {
      const file = files[indexFile];
      userImageLayers[j] = { ...userImageLayers[j], file };
      indexFile++;
      if (indexFile === files.length) {
        // files length
        indexFile = 0;
      }
    }

    const layersWithMask = [
      ...newPackTemplates[i].layers.map((layer) => {
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

        // layers level 2
        return {
          ...layer,
          layers: [
            // remove userImages not treated yet
            ...layer.layers.filter((subLayer) => subLayer.type !== "userImage"),
            // userImages with images
            ...userImageLayers.filter((userImageLayer) =>
              layer.layers.find((subLayer) => subLayer.id === userImageLayer.id)
            )
          ]
        };
      })
    ];

    newPackTemplates[i].layers = [...layersWithMask];
  }
  return newPackTemplates;
};

console.log("bindFilesToTemplates", bindFilesToTemplates(template));

// --------------------------- //
// ------------ component --------- //
// --------------------------- //
const Test = () => {
  return (
    <div className="flexCenter">
      <ReactJson
        src={bindFilesToTemplates(template)}
        theme="pop"
        displayDataTypes={false}
        style={classes.reactJson}
      />
    </div>
  );
};

export default Test;
