<template>
  <div>
    <button @click="actDescT1">add Markers</button>
    <input type="number" v-model="tracker">
    <input type="range" min="-50" max="50" v-model="rotation">
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
        dataMarkers: [],
        trackercount: 1,
        tracker: 1,
        rotation: null,
        TablesinTracker: null,
        inversors:[{longitude:-14.357297, latitude: 26.162878},
        {longitude:-14.359529, latitude: 26.162745},
        {longitude:-14.362233, latitude: 26.162573},
        {longitude:-14.354895, latitude: 26.163027},],
        terrainProvider: null,
        viewer: null,
        input: "",
        orientinput: null,
        scale: null,
      }
    },
    watch: {

      rotation:{
        handler(rotation){
            var markers = this.viewer.entities.values;
            markers.forEach(marker => {
              if (marker.name == this.tracker){
                marker.orientation = Cesium.Transforms.headingPitchRollQuaternion(marker.position.getValue(Cesium.JulianDate.now()), new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(355.7), Cesium.Math.toRadians(rotation)))
              }
            });
        }
      },

      scale: {
        handler(scale){
          this.dataMarkers.forEach(element => {
            element.scale = scale
          })
        }
      },
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
        this.addMarkers()
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
          destination: Cesium.Cartesian3.fromDegrees(-14.36376, 26.16000, 165.777159322902),
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
        this.inversors.forEach(marker => {
          var position = Cesium.Cartographic.fromDegrees(marker.longitude, marker.latitude);
          Cesium.sampleTerrainMostDetailed(this.terrainProvider, [position]).then(function(data) {
            var updatePosition = Cesium.Cartesian3.fromRadians(data[0].longitude,
                data[0].latitude, data[0].height);
            viewer.entities.add({
              name: '',
              orientation: Cesium.Transforms.headingPitchRollQuaternion(updatePosition, new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(265.7, 0, 0))),
              position: updatePosition,
              model: {
                uri: "/Inversor Glb/Base.glb",
                scale: 1,
              },
            })
            viewer.entities.add({
              name: '',
              orientation: Cesium.Transforms.headingPitchRollQuaternion(updatePosition, new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(265.7, 0, 0))),
              position: updatePosition,
              model: {
                uri: "/Inversor Glb/Transformador.glb",
                scale: 1,
              },
            })
            viewer.entities.add({
              name: '',
              orientation: Cesium.Transforms.headingPitchRollQuaternion(updatePosition, new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(265.7, 0, 0))),
              position: updatePosition,
              model: {
                uri: "/Inversor Glb/Inversor1.glb",
                scale: 1,
              },
            })
            viewer.entities.add({
              name: '',
              orientation: Cesium.Transforms.headingPitchRollQuaternion(updatePosition, new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(265.7, 0, 0))),
              position: updatePosition,
              model: {
                uri: "/Inversor Glb/Inversor2.glb",
                scale: 1,
              },
            })
            viewer.entities.add({
              name: '',
              orientation: Cesium.Transforms.headingPitchRollQuaternion(updatePosition, new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(265.7, 0, 0))),
              position: updatePosition,
              model: {
                uri: "/Inversor Glb/Inversor3.glb",
                scale: 1,
              },
            })
            viewer.entities.add({
              name: '',
              orientation: Cesium.Transforms.headingPitchRollQuaternion(updatePosition, new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(265.7, 0, 0))),
              position: updatePosition,
              model: {
                uri: "/Inversor Glb/Inversor4.glb",
                scale: 1,
              },
            })
            
          });
        })
        this.dataMarkers.forEach(marker => {
          //Obtener la altura del terreno
          if (marker.type == '30m') {
            var position = Cesium.Cartographic.fromDegrees(marker.longitude, marker.latitude);
          Cesium.sampleTerrainMostDetailed(this.terrainProvider, [position]).then(function(data) {
            var updatePosition = Cesium.Cartesian3.fromRadians(data[0].longitude,
                data[0].latitude, data[0].height + 2);
            var model = viewer.entities.add({
              name: marker.tracker,
              orientation: Cesium.Transforms.headingPitchRollQuaternion(updatePosition, new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(355.7), Cesium.Math.toRadians(20))),
              position: updatePosition,
              model: {
                uri: "/PanelSuperior30m.glb",
                scale: 1,
              },
            })
          });
          } 
          if (marker.type == '32m') {
            var position = Cesium.Cartographic.fromDegrees(marker.longitude, marker.latitude);
          Cesium.sampleTerrainMostDetailed(this.terrainProvider, [position]).then(function(data) {
            var updatePosition = Cesium.Cartesian3.fromRadians(data[0].longitude,
                data[0].latitude, data[0].height + 2 );
            var model = viewer.entities.add({
              name: marker.tracker,
              orientation: Cesium.Transforms.headingPitchRollQuaternion(updatePosition, new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(355.7), Cesium.Math.toRadians(-50))),
              position: updatePosition,
              model: {
                uri: "/PanelSuperior32m.glb",
                scale: 1,
              },
            })
          });
          }
        })

      
        
      },
      async Ubicacion(){
        await this.PanelsPosition(-14.363759, 26.160040, 4, 21, '30m');
        await this.PanelsPosition(-14.360604, 26.15990, 5, 43, '32m');
        await this.PanelsPosition(-14.354160, 26.160237, 5, 5, '32m');
        await this.PanelsPosition(-14.363708, 26.161205, 4, 1, '30m');
        await this.PanelsPosition(-14.363559, 26.1612327, 5, 9, '32m');
        await this.PanelsPosition(-14.362199, 26.1613038, 4, 2, '30m');
        await this.PanelsPosition(-14.361899, 26.161334, 5, 16, '32m');
        await this.PanelsPosition(-14.359518, 26.161476, 4, 2, '30m');
        await this.PanelsPosition(-14.359216, 26.161508, 5, 13, '32m');
        await this.PanelsPosition(-14.357285, 26.161615, 4, 2, '30m');
        await this.PanelsPosition(-14.356977, 26.161641, 5, 14, '32m');
        await this.PanelsPosition(-14.354884, 26.161761, 4, 2, '30m');
        await this.PanelsPosition(-14.354587, 26.161792, 5, 2, '32m');
        await this.PanelsPosition(-14.354281, 26.161744, 5, 6, '32m');
        await this.PanelsPosition(-14.363537, 26.162765, 4, 1, '30m');
        await this.PanelsPosition(-14.363389, 26.162783, 5, 42, '32m');
        await this.PanelsPosition(-14.357094, 26.163164, 4, 19, '30m');
        await this.PanelsPosition(-14.354234, 26.163289, 4, 4, '30m');
      },
      PanelsPosition(long, lat, ancho, largo, tipo) {
        var Position = {longitude: long, latitude: lat, type: tipo, tracker: this.trackercount};
        if (tipo == '30m') {
          for (let index = 0; index < largo; index++) {
            var element = Position
            for (let index = 0; index < ancho; index++) {
              this.dataMarkers.push(element);
              element = {longitude: element.longitude - 0.000023, latitude: element.latitude + 0.000281, type: tipo, tracker: this.trackercount}
              console.log(this.dataMarkers)
            }
            this.trackercount++
            Position = {longitude: Position.longitude + 0.000149, latitude: Position.latitude + 0.0000095, type: tipo, tracker: this.trackercount}
            
          }
        }
        if (tipo == '32m') {
          for (let index = 0; index < largo; index++) {
            var element = Position
            for (let index = 0; index < ancho; index++) {
              this.dataMarkers.push(element);
              element = {longitude: element.longitude - 0.000023, latitude: element.latitude + 0.000294, type: tipo, tracker: this.trackercount}
              console.log(this.dataMarkers)
            }
            this.trackercount++
            Position = {longitude: Position.longitude + 0.0001495, latitude: Position.latitude + 0.0000095, type: tipo, tracker: this.trackercount}
            
          }
        }
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
      this.Ubicacion();
      this.createMap();


      
      
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