/** @jsxRuntime classic /
/* @jsx jsx */
import { jsx } from "@emotion/react";
import { filterLayersByType } from "./actions/templates";

const files = [
  { file: "/me.jpg" },
  { file: "/le_cri.jpg" },
  { file: "/image1.jpg" },
  { file: "/anatomies.jpeg" }
  // { file: '/me.jpg'},
];

// const template = {
//   name: 'template1',
//   layers: [
//     {
//       id: 'mask1',
//       type: 'mask',
//       layers: [
//         { id: 'ui1', type: 'userImage' },
//         { id: 'ui11', type: 'userImage' },
//       ]
//     },
//     // {
//     //   id: 'mask2',
//     //   type: 'mask',
//     //   layers: [
//     //     { id: 'ui2', type: 'userImage' },
//     //     { id: 'ui21', type: 'userImage' },
//     //   ]
//     // },
//     // {
//     //   id: 'mask3',
//     //   type: 'mask',
//     //   layers: [
//     //     { id: 'ui3', type: 'userImage' },
//     //     { id: 'ui31', type: 'userImage' },
//     //   ]
//     // },
//     // {
//     //   id: 'mask4',
//     //   type: 'mask',
//     //   layers: [
//     //     { id: 'ui4', type: 'userImage' },
//     //     { id: 'ui41', type: 'userImage' },
//     //   ]
//     // },
//     // {
//     //   id: 'ui3',
//     //   type: 'userImage',
//     // },
//     // {
//     //   id: 'ut1',
//     //   type: 'userText',
//     // }
//   ]
// };

// console.log(bindFilesToLayers(template, files));

const template = {
  name: "template1",
  layers: [
    { id: "ui1", type: "userImage" },
    { id: "ui11", type: "userImage" }
  ]
};
const userImageWithFiles = [];
const userImages = filterLayersByType(template.layers, "userImage");
for (let i = 0; i < userImages.length; i++) {
  userImageWithFiles[i] = [...files];
  // userImageWithFiles[i] = [...files.map((n, k) => ({ ...n, key: Math.floor(Math.random() * 1000)  }))];
}
const packTemplates = [];
new Array(4).fill(0).forEach((_, index) => {
  // console.log('userImageWithFiles', userImageWithFiles);
  // 1t
  const newTemplate = {
    ...template
    // 2l
    // layers: bindFilesToLayers(template, userImageWithFiles.flat(), index),
  };
  packTemplates.push(newTemplate);
});

const bindFilesToLayers = (template, files) => {
  const userImages = filterLayersByType(
    template.layers,
    "userImage"
  );

  files.forEach((file, index) => {
    // console.log(file)
    // let montageLayer = montageLayerById.get(layer.id);
    if (!userImages[index]) return;
    userImages[index].file = file;
  });

  const userImageLayerById = new Map();
  userImages.forEach((layer) => {
    userImageLayerById.set(layer.id, layer);
  });
  const newLayers = [];
  for (const layer of template.layers) {
    if (layer.type === "userImage") {
      const uiLayer = userImageLayerById.get(layer.id);
      newLayers.push(uiLayer);
    } else if (layer.type === "mask") {
      let newSubLayers;
      for (const subLayer of layer.layers) {
        if (subLayer.type === "userImage") {
          const uiLayer = userImageLayerById.get(subLayer.id);
          const maskSubLayers = {
            ...layer,
            layers: [
              ...layer.layers.filter((l) => l.id !== uiLayer.id),
              uiLayer
            ]
          };
          newSubLayers = maskSubLayers;
        } else {
          newSubLayers = subLayer;
        }
      }
      newLayers.push(newSubLayers);
    } else {
      newLayers.push(layer);
    }
  }
  return newLayers;
};
const newTemplates2 = [];
packTemplates.forEach((pack, index) => {
  newTemplates2.push({
    ...pack,
    layers: bindFilesToLayers(pack, userImageWithFiles.flat())
  });
});

console.log(newTemplates2);

const Test = () => {
  return <div className="flexCenter">text</div>;
};

export default Test;
