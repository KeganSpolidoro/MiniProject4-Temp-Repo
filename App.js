import { StyleSheet, Text, View, Image } from "react-native";
import { Camera, CameraType } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import React, { useState, useEffect, useRef } from "react";
import Button from "./src/components/Button";

export default function App() {
  // asking for permissions to use the camer and media library
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [image1, setimage1] = useState(null);
  const [image2, setimage2] = useState(null);
  const [type, setType] = useState(CameraType.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const cameraRef = useRef(null);

  useEffect(() => {
    const getCameraPermissions = async () => {
      try {
        await MediaLibrary.requestPermissionsAsync();
        const cameraStatus = await Camera.requestCameraPermissionsAsync();

        if (cameraStatus && cameraStatus.status === "granted") {
          setHasCameraPermission(true);
        } else {
          console.error(
            "Camera permission not granted or camera status not available."
          );
        }
      } catch (error) {
        console.log(error);
      }
    };
    getCameraPermissions();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        // here is where we actually take the picture
        const picture1 = await cameraRef.current.takePictureAsync();
        console.log(picture1);

        toggleCameraType();

        await new Promise((resolve) => setTimeout(resolve, 1500));

        if (cameraRef.current) {
          const picture2 = await cameraRef.current.takePictureAsync();
          console.log(picture2);

          setimage1(picture1.uri);
          setimage2(picture2.uri);
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  const onCameraReady = () => {};

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  const saveImage = async () => {
    if (image1) {
      try {
        await MediaLibrary.createAssetAsync(image1);
        alert("image1 saved");
        setimage1(null);

        await MediaLibrary.createAssetAsync(image2);
        alert("image2 saved");

        // now we can push the image to the db
        // we write code for that in this function
        setimage2(null);
      } catch (e) {
        console.log(e);
      }
    }
  };

  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {!image1 ? (
        <View>
          <View
            style={{
              width: "100%",
              height: "80%",
            }}
          >
            <Camera
              style={styles.camera}
              type={type}
              flashMode={flash}
              ref={cameraRef}
              onCameraReady={onCameraReady}
            ></Camera>
          </View>
          <View style={styles.buttonsContainer}>
            <Button
              icon="flash"
              iconSize={30}
              onPress={() => {
                setFlash(
                  flash === Camera.Constants.FlashMode.off
                    ? Camera.Constants.FlashMode.on
                    : Camera.Constants.FlashMode.off
                );
              }}
            />
            <Button icon="circle" iconSize={90} onPress={takePicture} />

            <Button icon="retweet" iconSize={30} onPress={toggleCameraType} />
          </View>
        </View>
      ) : (
        <View
          style={{
            width: "100%",
            height: "90%",
            borderRadius: 20,
          }}
        >
          <View style={styles.imageContainer}>
            <Image source={{ uri: image1 }} style={styles.image} />
            <Image
              source={{ uri: image2 }}
              style={[styles.image, styles.image2]}
            />
            <View style={styles.crossButtonContainer}>
              <Button
                title={""}
                icon="cross"
                iconSize={40}
                onPress={() => {
                  setimage1(null), setimage2(null);
                }}
                style={styles.crossButton}
              />
            </View>
          </View>
          <View style={styles.saveButtonContainer}>
            <Button
              title={"Save"}
              icon="triangle-right"
              iconSize={30}
              onPress={saveImage}
              style={styles.saveButton}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
  },
  camera: {
    flex: 1,
    borderRadius: 20,
    marginTop: "25%",
    zIndex: 1,
    overflow: "hidden", // Ensure camera content doesn't overflow
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: "100%",
    overflow: "hidden",
    borderRadius: 20,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    borderRadius: 20,
  },
  image2: {
    position: "absolute",
    top: "5%",
    left: 10,
    width: "38%",
    height: "30%",
    zIndex: 1,
    borderRadius: 20,
    borderColor: "black",
    borderWidth: 3,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: "20%",
    paddingTop: 30,
  },
  crossButtonContainer: {
    position: "absolute",
    right: "5%",
    zIndex: 1,
  },
  crossButton: {},
  saveButtonContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "15%",
    backgroundColor: "black",
  },
  saveButton: {},
});
