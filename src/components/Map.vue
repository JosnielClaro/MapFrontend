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
    <input type="range" min="90" max="3000" v-model="scale">
    <button @click="getCameraCoordinates"> posicion de la camara </button>
  </div>
  <div class="map-container">
    <div id="cesiumContainer">
      <div id="markerList"> 
        <div v-for="(marker, id) in dataMarkers" :key="id" @click="Centrar(marker.longitude, marker.latitude)">
          <img :id="marker.active? 'icons':''" v-if="marker.status == 1" src="/fanverde.png" alt="">
          <img :id="marker.active? 'icons':''" v-if="marker.status == 2" src="/fangris.png" alt="">
          <img :id="marker.active? 'icons':''" v-if="marker.status == 3" src="/fanrojo.png" alt="">
        </div>
      </div>
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
          orientation: 0,
          scale: 90},
        {longitude: 8.25,
          latitude: 46.87,
          active: false,
          status: 3,
          description: 'Turbina 2',
          orientation: 90,
          scale: 90},
        {longitude: 8.38,
          latitude: 46.71,
          active: true,
          status: 2,
          description: 'Turbina 3',
          orientation: 180,
          scale: 90}],
        torre: {longitude: 8.3700000001, latitude: 46.7100000001,},
        veletas: [{altura: 60, orientation: 0, active: false}, {altura: 80, orientation: 90, active: true}, {altura: 90, orientation: 0, active: true}],
        anenometros: [{altura: 60, active: true}, {altura: 90, active: false}],
        terrainProvider: null,
        viewer: null,
        input: "",
        orientinput: null,
        scale: null,
      }
    },
    watch: {

      scale: {
        handler(scale){
          this.dataMarkers.forEach(element => {
            element.scale = scale
          })
        }
      },
      
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
              marker.position = updatePosition;
              marker.orientation = Cesium.Transforms.headingPitchRollQuaternion(updatePosition, new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(element.orientation + 270, 0, 0)));
              marker.model.scale = element.scale;
            })
            if (!element.active) {
              marker.model.runAnimations = false;
            }
            if (element.active) {
              marker.model.runAnimations = true;
            }
            if (element.status == 1) {
              marker.model.color = Cesium.Color.CHARTREUSE.withAlpha(1);
            }
            if (element.status == 2) {
              marker.model.color = Cesium.Color.GREY.withAlpha(1);
            }
            if (element.status == 3) {
              marker.model.color = Cesium.Color.ORANGERED.withAlpha(1);
            }
          });
        }
        
        
      }
    },
    methods: {
      Centrar(longitude, latitude){
        var position = Cesium.Cartesian3.fromDegrees(longitude, latitude - 0.000002, 2200);
        this.viewer.camera.flyTo({destination: position,
          orientation: {
            pitch: Cesium.Math.toRadians(-25)
          }})
        console.log(position)
      },
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
          destination: Cesium.Cartesian3.fromDegrees(8.370234123540236, 46.709413390003604 , 2765.777159322902),
          orientation: {
            pitch: Cesium.Math.toRadians(-20)
          }
        });
        this.viewer.scene.globe.depthTestAgainstTerrain = true;
        this.viewer.clock.multiplier = 1; // Esto hace que el tiempo avance a velocidad normal
        this.viewer.clock.shouldAnimate = true; // Esto asegura que el reloj esté activo
        var viewer = this.viewer
        function handleDoubleClick() {
          console.log('fasdw')
          viewer.scene.screenSpaceCameraController.enableInputs = false;
          setTimeout(() => {
            viewer.scene.screenSpaceCameraController.enableInputs = true;
          }, 10);
        }
        this.viewer.screenSpaceEventHandler.setInputAction(handleDoubleClick, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

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
                uri: "/EolicAnimate1m.glb",
                scale: 500,
              },
              description: marker.description
            })
            if (!marker.active) {
              model.model.runAnimations = false;
            }
            if (marker.status == 1) {
              model.model.color = Cesium.Color.CHARTREUSE.withAlpha(1);
            }
            if (marker.status == 2) {
              model.model.color = Cesium.Color.GREY.withAlpha(1);
            }
            if (marker.status == 3) {
              model.model.color = Cesium.Color.ORANGERED.withAlpha(1);
            }
          });
        })

        
        
      },
      addTorre() {
        var viewer = this.viewer
        var position = Cesium.Cartographic.fromDegrees(this.torre.longitude, this.torre.latitude);
          Cesium.sampleTerrainMostDetailed(this.terrainProvider, [position]).then(function(data) {
            var updatePosition = Cesium.Cartesian3.fromRadians(data[0].longitude,
                data[0].latitude, data[0].height);
            var model = viewer.entities.add({
              name: '',
              position: updatePosition,
              model: {
                uri: "/torre.glb",
                scale: 1,
              },
            })
          })
        this.anenometros.forEach(element => {
          var position = Cesium.Cartographic.fromDegrees(this.torre.longitude, this.torre.latitude);
          Cesium.sampleTerrainMostDetailed(this.terrainProvider, [position]).then(function(data) {
            var updatePosition = Cesium.Cartesian3.fromRadians(data[0].longitude,
                data[0].latitude, data[0].height + element.altura);
            var model = viewer.entities.add({
              name: '',
              position: updatePosition,
              model: {
                uri: "/anemometro -90.glb",
                scale: 1,
              },
            })
            if (element.active) {
              model.model.color = Cesium.Color.CHARTREUSE.withAlpha(1);
            }
            else {
              model.model.color = Cesium.Color.GREY.withAlpha(1);
            }
            var sop = viewer.entities.add({
              name: '',
              position: updatePosition,
              model: {
                uri: "/soporte -90.glb",
                scale: 1,
              },
            })
          })
        });
        this.veletas.forEach(element => {
          var Vposition = Cesium.Cartographic.fromDegrees(this.torre.longitude - 0.0000064, this.torre.latitude + 0.000035);
          var position = Cesium.Cartographic.fromDegrees(this.torre.longitude, this.torre.latitude);
          Cesium.sampleTerrainMostDetailed(this.terrainProvider, [position]).then(function(data) {
            var updatePosition = Cesium.Cartesian3.fromRadians(data[0].longitude,
                data[0].latitude, data[0].height + element.altura);
            var VupdatePosition = Cesium.Cartesian3.fromRadians(Vposition.longitude,
                Vposition.latitude, data[0].height + element.altura);
            var model = viewer.entities.add({
              name: '',
              orientation: Cesium.Transforms.headingPitchRollQuaternion(VupdatePosition, new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(element.orientation + 270, 0, 0))),
              position: VupdatePosition,
              model: {
                uri: "/veleta.glb",
                scale: 1,
              },
            })
            if (element.active) {
              model.model.color = Cesium.Color.CHARTREUSE.withAlpha(1);
            }
            else {
              model.model.color = Cesium.Color.GREY.withAlpha(1);
            }
            var model = viewer.entities.add({
              name: '',
              position: updatePosition,
              model: {
                uri: "/soporte.glb",
                scale: 1,
              },
            })
          })
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
      this.addTorre();
      setInterval(() => {
        this.dataMarkers[0].orientation = this.dataMarkers[0].orientation + 20
      }, 5000);


      
      
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
    z-index: 1;
  }
  .map-container {
    width: 800px;
    height: 600px;
  }
  #markerList {
    position: absolute;
    top: 10px;
    left: 10px;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    z-index: 2;
  }
  #icons {
    margin: 5px;
    text-align: center;
    animation: rotation 8s infinite linear;
  }

  @keyframes rotation {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(359deg);
    }
  }
</style>