import * as React from "react";
import { useState } from "react";
import { RouteProp } from "@react-navigation/core";
import { FrameNavigationProp } from "react-nativescript-navigation";
import { StyleSheet } from "react-nativescript";
import { MainStackParamList } from "./NavigationParamList";
import { WebViewEventData } from "@nota/nativescript-webview-ext";

type HomeScreenProps = {
  route: RouteProp<MainStackParamList, "Home">;
  navigation: FrameNavigationProp<MainStackParamList, "Home">;
};

const htmlString = `
<html>
  <head>
    <link
      rel="stylesheet"
      type="text/css"
      href="https://api.tomtom.com/maps-sdk-for-web/cdn/5.x/5.69.1/maps/maps.css"
    />
    <script src="https://api.tomtom.com/maps-sdk-for-web/cdn/5.x/5.69.1/maps/maps-web.min.js"></script>
  </head>
  <body style="width: 100%; height: 100%; margin: 0; padding: 0">
    <div
      id="map"
      style="width: 100%; height: 100%; background-color: orangered"
    ></div>
    <script>
      var map = tt.map({
        key: 'YOUR_API_KEY',
        container: 'map',
        style: 'tomtom://vector/1/basic-main',
        center: [-121.913, 37.361],
        zoom: 15
      });

      window.addEventListener("ns-bridge-ready", function(e) {
        var nsWebViewBridge = e.detail || window.nsWebViewBridge;
        map.on('dragend', function() {
          let center = map.getCenter();
          nsWebViewBridge.emit("mapCenterChanged", 
            center.lng.toFixed(3) + ", " + center.lat.toFixed(3));
        });
      });
      
      function setCenter(lng, lat) {
        map.setCenter([lng, lat]);
      }
    </script>
  </body>
</html>
`; 

export function HomeScreen({ navigation }: HomeScreenProps) {
  let webView = undefined;
  let [mapCenter, setMapCenter] = useState('-121.913, 37.361');

  function onButtonPress() {
    const [lng, lat] = mapCenter.split(",");
    webView.executeJavaScript(`setCenter(${parseFloat(lng)}, ${parseFloat(lat)});`);
  }

  const handleMapEvent = (args: WebViewEventData) => {
    setMapCenter(args.data);
  }

  function initializeWebView(viewComponent) {
    webView = viewComponent;
    webView.on("mapCenterChanged", handleMapEvent);
  }

  return (
    <stackLayout style={styles.container}>
      <label style={styles.headingText}>TomTom NativeScript WebView</label>
      <flexboxLayout>
        <textField style={styles.textInput}
                   text={mapCenter} 
                   onTextChange={(args) =>setMapCenter(args.value)}/>
        <button onTap={onButtonPress} text="Set Center" />
      </flexboxLayout>
      <webViewExt 
        ref={(r) => { r && initializeWebView(r._nativeView);}} 
        src={htmlString} 
        style={styles.webView} />
    </stackLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50
  },
  headingText: {
    textAlignment: "center",
    fontSize: 24,
    color: "white",
    marginBottom: 10
  },
  textInput: {
    marginLeft: 10,
    width: "60%"
  },
  button: {
    fontSize: 24,
    color: "#2e6ddf"
  }, 
  webView: {
    marginTop: 10,
    height: "80%"
  }
});
