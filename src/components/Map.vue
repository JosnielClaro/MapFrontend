<template>
  <div>
    <button @click="activeT1">On/off T1</button>
    <button @click="status1T1">status1 T1</button>
    <button @click="status2T1">status2 T1</button>
    <button @click="status3T1">status3 T1</button>
    <button @click="activeT2">On/off T2</button>
    <button @click="status1T2">status1 T2</button>
    <button @click="status2T2">status2 T2</button>
    <button @click="status3T2">status3 T2</button>
    <input type="text" v-model="input">
    <button @click="actDescT1">actDescT1</button>
    <input type="number" v-model="orientinput">
    <button @click="actOrientT3">actOrientT3</button>
  </div>
  <div class="map-container">
    <div id="cesiumContainer">
    </div>
  </div>
</template>
<script>

import CesiumNavigation from "cesium-navigation-es6";

  export default {
    data(){
      return {
        dataMarkers: [{longitude: 8.67,
          latitude: 46.72,
          active: true,
          status: 1,
          description: 'Turbina 1',
          orientation: 0},
        {longitude: 8.25,
          latitude: 46.87,
          active: false,
          status: 3,
          description: 'Turbina 2',
          orientation: 90},
        {longitude: 8.38,
          latitude: 46.71,
          active: true,
          status: 2,
          description: 'Turbina 3',
          orientation: 180}],
        terrainProvider: null,
        viewer: null,
        input: "",
        orientinput: null,
      }
    },
    watch: {
      
      dataMarkers: {
        deep: true,
        handler(items) {
          var markers = this.viewer.entities.values;
          items.forEach((element, index) => {
            var marker = markers[index]
            marker.description = element.description;
            var position = Cesium.Cartographic.fromDegrees(element.longitude, element.latitude);
            Cesium.sampleTerrainMostDetailed(this.terrainProvider, [position]).then(function(data) {
              var updatePosition = Cesium.Cartesian3.fromRadians(data[0].longitude,
                  data[0].latitude, data[0].height);
              marker.orientation = Cesium.Transforms.headingPitchRollQuaternion(updatePosition, new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(element.orientation + 270, 0, 0)));
            })
            if (!element.active) {
              marker.model.runAnimations = false;
            }
            if (element.active) {
              marker.model.runAnimations = true;
            }
            if (element.status == 1) {
              marker.model.color = Cesium.Color.GREEN.withAlpha(1);
            }
            if (element.status == 2) {
              marker.model.color = Cesium.Color.BLUE.withAlpha(1);
            }
            if (element.status == 3) {
              marker.model.color = Cesium.Color.RED.withAlpha(1);
            }
          });
        }
        
        
      }
    },
    methods: {
      actDescT1() {
        this.dataMarkers[0].description = this.input
      },
      actOrientT3() {
        this.dataMarkers[2].orientation = this.orientinput
      },
      activeT1() {
        this.dataMarkers[0].active = !this.dataMarkers[0].active;
      },
      activeT2() {
        this.dataMarkers[1].active = !this.dataMarkers[1].active;
      },
      status1T1() {
        this.dataMarkers[0].status = 1;
      },
      status2T1() {
        this.dataMarkers[0].status = 2;
      },
      status3T1() {
        this.dataMarkers[0].status = 3;
      },
      status1T2() {
        this.dataMarkers[1].status = 1;
      },
      status2T2() {
        this.dataMarkers[1].status = 2;
      },
      status3T2() {
        this.dataMarkers[1].status = 3;
      },
      degreesToRadians(degrees) {
        return degrees * Math.PI / 180;
      },
      createOrientation(angleDegrees) {
        var heading = this.degreesToRadians(angleDegrees);
        var pitch = 0;
        var roll = 0;
        return Cesium.Transforms.headingPitchRollQuaternion(position, new Cesium.HeadingPitchRoll(heading, pitch, roll));
      },
      createMap() {
        const key = 'K1QdGd1zXrTbjToDlDPZ';
        this.viewer = new Cesium.Viewer('cesiumContainer', {
          animation: false,
          baseLayerPicker: false,
          navigationHelpButton: false,
          sceneModePicker: false,
          homeButton: false,
          geocoder: false,
          fullscreenButton: false,
          imageryProvider: new Cesium.UrlTemplateImageryProvider({
            url: `https://api.maptiler.com/tiles/satellite-v2/{z}/{x}/{y}.jpg?key=${key}`,
            minimumLevel: 0,
            maximumLevel: 20,
            tileWidth: 512,
            tileHeight: 512,
            credit: new Cesium.Credit("\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e", true)
          }),
          timeline: false,
          terrainProvider: new Cesium.CesiumTerrainProvider({
            url: `https://api.maptiler.com/tiles/terrain-quantized-mesh-v2/?key=${key}`,
            credit: new Cesium.Credit("\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy;MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e", true),
            requestVertexNormals: true
          })
        });
        this.terrainProvider = this.viewer.terrainProvider;
        

        this.viewer.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(8.487755669693277, 46.101943420094244 , 19657.0371192774),
          orientation: {
            pitch: Cesium.Math.toRadians(-20)
          }
        });
        this.viewer.scene.globe.depthTestAgainstTerrain = true;
        this.viewer.clock.multiplier = 1; // Esto hace que el tiempo avance a velocidad normal
        this.viewer.clock.shouldAnimate = true; // Esto asegura que el reloj esté activo
        
        let cesiumNavigation = new CesiumNavigation(this.viewer, {
          enableCompass: true,
          enableZoomControls: true,
          enableDistanceLegend: true,
          enableCompassOuterRing: true
        });
      },
      addMarkers() {
        var viewer = this.viewer
        this.dataMarkers.forEach(marker => {
          //Obtener la altura del terreno
          var position = Cesium.Cartographic.fromDegrees(marker.longitude, marker.latitude);
          Cesium.sampleTerrainMostDetailed(this.terrainProvider, [position]).then(function(data) {
            var updatePosition = Cesium.Cartesian3.fromRadians(data[0].longitude,
                data[0].latitude, data[0].height);
            var model = viewer.entities.add({
              name: '',
              orientation: Cesium.Transforms.headingPitchRollQuaternion(updatePosition, new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(marker.orientation + 270, 0, 0))),
              position: updatePosition,
              model: {
                uri: "/EolicAnimate.glb",
                scale: 300,
              },
              description: marker.description
            })
            if (!marker.active) {
              model.model.runAnimations = false;
            }
            if (marker.status == 1) {
              model.model.color = Cesium.Color.GREEN.withAlpha(1);
            }
            if (marker.status == 2) {
              model.model.color = Cesium.Color.BLUE.withAlpha(1);
            }
            if (marker.status == 3) {
              model.model.color = Cesium.Color.RED.withAlpha(1);
            }
          });
        })

        
        
      },
      getCameraCoordinates() {
            var cameraPositionCartographic = Cesium.Cartographic.fromCartesian(this.viewer.camera.position);

            var latitude = Cesium.Math.toDegrees(cameraPositionCartographic.latitude);
            var longitude = Cesium.Math.toDegrees(cameraPositionCartographic.longitude);
            var altitude = cameraPositionCartographic.height;

            console.log(latitude)
            console.log(longitude)
            console.log(altitude)
        }
    },
    computed: {
      
    },
    mounted() {
      this.createMap();
      this.addMarkers();


      
      
      window.onload = function (){
        
      }
    }
  }

  
</script>

<style>
  @import url(https://cesium.com/downloads/cesiumjs/releases/1.98/Build/Cesium/Widgets/widgets.css);

  #cesiumContainer {position:relative; 
    height: 100%;
    width: 100%;
  }
  .map-container {
    width: 800px;
    height: 600px;
  }
</style>