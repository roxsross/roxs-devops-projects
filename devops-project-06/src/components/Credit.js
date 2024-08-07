import React from "react";
import packageInfo from '../../package.json'; 


export default function Credit() {
  return (
    <div className="credit">
      <p>Versión {packageInfo.version}</p>
      <p>
        Coded by <a href="https://github.com/roxsross">@RoxsRoss</a>, <a href="https://github.com/shemmee/React-Weather-App">Open sourced on Github.</a>
      </p>
    </div>
  );
}
