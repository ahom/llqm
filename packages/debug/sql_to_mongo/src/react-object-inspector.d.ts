/// <reference path="../typings/react/react.d.ts"/>
    
declare module "react-object-inspector" {
    import React = require("react");
   
    interface ObjectInspectorProps extends React.Props<ObjectInspectorClass> {
        data? : any
    }

    interface ObjectInspector extends React.ReactElement<ObjectInspectorProps> {}
    interface ObjectInspectorClass extends React.ComponentClass<ObjectInspectorProps> {}
    var ObjectInspector : ObjectInspectorClass;

    export = ObjectInspector;
}
