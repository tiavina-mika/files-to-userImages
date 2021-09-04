/** @jsxRuntime classic /
/* @jsx jsx */
import { jsx } from "@emotion/react";
import ReactJson from "react-json-view";
import PropTypes from "prop-types";

import Typography from "./Typography";

const classes = {
  reactJson: {
    width: "100%",
    padding: 20
  },
  title: {
    marginLeft: 10
  }
};

const Bloc = ({ title, description, src }) => {
  return (
    <div className="flexColumn stretchSelf">
      <Typography css={classes.title} variant="title">
        {title}
      </Typography>
      {description && (
        <Typography css={classes.title} variant="paragraph">
          {description}
        </Typography>
      )}

      {src && (
        <ReactJson
          src={src}
          theme="pop"
          displayDataTypes={false}
          style={classes.reactJson}
          displayArrayKey={false}
          displayObjectSize={false}
        />
      )}
    </div>
  );
};

Bloc.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  src: PropTypes.any
};

export default Bloc;
