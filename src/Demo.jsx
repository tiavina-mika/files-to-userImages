/** @jsxRuntime classic /
/* @jsx jsx */
import { jsx } from "@emotion/react";
import Bloc from "./components/Bloc";

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
        { id: "ui1", type: "userImage", file: { file: "/ui1.jpg" } },
        { id: "ui11", type: "userImage", file: { file: "/ui11.jpg" } },
        { id: "ut1", type: "userText" },
        { id: "i1", type: "image" }
      ]
    },
    { id: "i2", type: "image" },
    { id: "ui12", type: "userImage", file: { file: "/ui12.jpg" } }
  ]
};

// the selected layer to change image
const selectedLayer = {
  id: "ui11",
  type: "userImage",
  file: { file: "/ui11.jpg" }
};

// new file to insert
const newFile = { file: "/anomalie.jpeg" };

/**
 * update the template with new updated layers
 */
const updateSelectedTemplate = ({ selectedTemplate, selectedLayer, file }) => {
  const template = { ...selectedTemplate };

  let newTemplateLayers = [];
  for (const layer of template.layers) {
    const newLayers = [];

    if (layer.type === "mask") {
      const newSubLayers = [];
      for (const subLayer of layer.layers) {
        if (subLayer.id === selectedLayer.id) {
          newSubLayers.push({ ...selectedLayer, file });
        } else {
          newSubLayers.push(subLayer);
        }
      }
      newLayers.push({ ...layer, layers: newSubLayers });
    } else {
      if (layer.id === selectedLayer.id) {
        newLayers.push({ ...selectedLayer, file });
      } else {
        newLayers.push(layer);
      }
    }
    newTemplateLayers.push(newLayers);
  }

  return { ...template, layers: newTemplateLayers.flat() };
};

// --------------------------- //
// -------- component -------- //
// --------------------------- //
const Demo = () => {
  return (
    <div className="flexCenter">
      <Bloc
        title="Description"
        description="Update a level 1 or level 2 userImage layer.
        Select a layer, then update its file to a new selected one."
      />
      <Bloc title="Template" src={template} />
      <Bloc
        title="Selected Layer"
        description="Layer to update"
        src={selectedLayer}
      />
      <Bloc
        title="Selected File"
        description="File to insert to the selected layer"
        src={newFile}
      />
      <Bloc
        title="Output"
        src={updateSelectedTemplate({
          selectedLayer,
          file: newFile,
          selectedTemplate: template
        })}
      />
    </div>
  );
};

export default Demo;
