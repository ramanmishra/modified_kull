<template>
  <div>
    <div class="editor">
      <div class="sidebar">
        <Uploader :notify="newFile"></Uploader>
        <p v-if="name">
          <strong></strong>
        </p>
      </div>
      <div class="content">
        <Annotator
          :src="src"
          :setPdfSize="setPdfSize"
          :arrayBuffer="arrayBuffer"
          :name="name"
          :selections="selections"
          :addSelection="addSelection"
          :x1="x1"
          :y1="y1"
          :x2="x2"
          :y2="y2"
        ></Annotator>
      </div>
    </div>
    <!-- <button type="submit" v-on:click="submitForm">submit</button> -->
  </div>
</template>

<script>
import Uploader from "@/components/Uploader";
import Annotator from "@/components/AnnotatorWithoutAnnotation";
import ZoneViewer from "@/components/ZoneViewer";
import PDFZoneViewer from "@/components/PDFZoneViewer";
import randomColor from "randomcolor";
import axios from "axios";
console.log("This.route:", this.$route);
if (this.$route != undefined) console.log("Editor Params:", this.$route.params);
export default {
  name: "editor",
  components: {
    Uploader,
    Annotator,
    ZoneViewer,
    PDFZoneViewer
  },
  data() {
    return {
      src: null,
      arrayBuffer: null,
      name: "",
      selections: [],
      pdfDimensions: {
        height: 0,
        width: 0
      },
      x1: this.$route.params.x1,
      y1: this.$route.params.y1,
      x2: this.$route.params.x2,
      y2: this.$route.params.y2
    };
  },
  created() {
    let file = window.localStorage.getItem("name");
    let arrayBuffer = window.localStorage.getItem("arrayBuffer");
    let src = window.localStorage.getItem("src");
    console.log(file, arrayBuffer, src);
    if (file && (arrayBuffer || src)) {
      this.newFile({
        file: file,
        arrayBuffer: this.str2ab(arrayBuffer),
        src: src
      },false);
    }
    console.log("This.route:", this.$route);
  },
  methods: {
    batchUpdateSelections: function(selections) {
      this.selections = selections;
    },
    setPdfSize: function(width, height) {
      this.pdfDimensions = {
        width: width,
        height: height
      };
    },
    addSelection: function(coords) {
      console.log("Editor coords:", coords);
      if (coords.height === 0 || coords.width === 0) {
        return;
      }

      this.selections.push({
        id: +new Date(),
        coordinates: {
          top: coords.top,
          left: coords.left,
          height: coords.height,
          width: coords.width,
          page: coords.page,
          pageOffset: coords.pageOffset
        },
        color: randomColor({ format: "rgb" }),
        name: prompt("Enter name")
      });
      console.log("this.selections:", this.selections);
    },
    ab2str(buf) {
      return String.fromCharCode.apply(null, new Uint16Array(buf));
    },

    str2ab(str) {
      var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
      var bufView = new Uint16Array(buf);
      for (var i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
      }
      return buf;
    },
    newFile: function(data, flag) {
      if (flag) {
        window.localStorage.clear();
        data.name ? window.localStorage.setItem("name", data.name) : undefined;
        data.arrayBuffer
          ? window.localStorage.setItem(
              "arrayBuffer",
              this.ab2str(data.arrayBuffer)
            )
          : undefined;
        data.src ? window.localStorage.setItem("src", data.src) : undefined;
      }
      this.name = data.name;
      this.src = data.src;
      this.arrayBuffer = data.arrayBuffer;
      this.selections = [];
    },
    submitForm: function() {
      console.log("Form Submitted!!!");
      let data = this.selections.map(sel => {
        let field_name = sel.name;
        let x1 = sel.coordinates.left;
        let y1 = sel.coordinates.top;
        let x2 = x1 + sel.coordinates.width;
        let y2 = y1 + sel.coordinates.height;
        let coordinates = [x1, y1, x2, y2];
        let page = sel.coordinates.page;
        let form_name = "Form Type 1";
        return { field_name, coordinates, page, form_name };
      });
      data = JSON.stringify(data);
      console.log("Data to be sent is:", data);
      axios
        .post("http://1d85b46b.ngrok.io/form", {
          data: data,
          responseType: "json"
        })
        .then(function(response) {
          console.log("Response from API:", response);
        })
        .catch(function(error) {
          console.log("Error occured:", error);
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.editor {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  margin-top: 60px;
}

.sidebar {
  position: inherit;
  width: 200px;
  top: 0;
  left: 0;
  padding: 10px;
}

.content {
  position: absolute;
  width: auto;
  margin-left: 30px;
  top: 0px;
  left: 410px;
}

textarea {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  font-size: 1em;
}

h2 {
  background: #fff800;
  padding: 10px 25px;
}

h1 {
  background: #c50080;
  padding: 10px 25px;
  color: white;
}
</style>
