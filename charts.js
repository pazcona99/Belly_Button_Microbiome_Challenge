function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file
  d3.json("samples.json").then((data) => {
    console.log(data);
    // 3. Create a variable that holds the samples array.
    var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sample_array = samples.filter((sampleObj) => sampleObj.id == sample);
    var result = sample_array[0];
    //  5. Create a variable that holds the first sample in the array.
    var metadata_array = data.metadata.filter(
      (sampleObj) => sampleObj.id == sample
    );
    var metadata = metadata_array[0];
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order
    //  so the otu_ids with the most bacteria are last.

    var yticks = otu_ids
      .slice(0, 10)
      .map((otuID) => `OTU ${otuID}`)
      .reverse();

    // 8. Create the trace for the bar chart.
    var barData = [
      {
        x: sample_values.slice(0, 10).reverse(),
        y: yticks,
        orientation: "h",
        type: "bar",
        text: otu_labels.slice(0, 10).reverse(),
      },
    ];
    // 9. Create the layout for the bar chart.
    var barLayout = {
      margin: { t: 30, l: 150 },
      title: "Top Ten Bacteria Cultures",
    };
    // 10. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bar", barData, barLayout);

    // Deliverable 2
    // Create trace for the bubble chart
    var trace2 = {
      x: otu_ids,
      y: sample_values,
      mode: 'markers',
      hovertext: otu_labels,
      marker: {
        color: otu_ids,
        size: sample_values,
        colorscale: "Earth"
      }
    };
    
    var bubbleData = [trace2];

    // Create layout for the bubble chart
    var bubbleLayout = {
      title: "<b>Bacteria Cultures Per Sample</b>",
      xaxis:{title: "OTU ID"},
      hovermode: 'closest',
      width:1145
    };

    // Use plotly to plot the bubble chart
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    //Deliverable 3:  Create the trace for the guage chart
    // Create a variable that filters the samples for the object with the desired sample number.
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    // Create a variable that holds the first sample in the array.
    // 2. Create a variable that holds the first sample in the metadata array.
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var wFreq = result.wfreq;

    // Create the trace for the gauge chart
    var trace3 = {
      type: "indicator",
      mode: "gauge+number",
      value: wFreq,
		  title: { text: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week"},
      gauge: {
        axis: {range: [0,10],tickwidth: 3, tickcolor: "black"},
        bar: {color: "black"},
        steps: [
          { range: [0, 2], color: "wheat" },
          { range: [2, 4], color: "goldenrod" },
          { range: [4, 6], color: "palegreen" },
          { range: [6, 8], color: "lightseagreen" },
          { range: [8, 10], color: "darkslateblue" },
        ],
      }
       };

    var gaugeData = [trace3];

    // Create the gauge layout
    var gaugeLayout = {
      width: 460,
      height: 400, 
      margin: {t:0, b:0}
    };

    // Use plotly to plot the gauage plot
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);

  });
}


