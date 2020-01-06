function init() {
    var selector = d3.select("#selDataset");

    d3.json("samples.json").then((data) => {
        console.log(data);
        var sampleNames = data.names;
        sampleNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });
    })
}




function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
}


function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        var PANEL = d3.select("#sample-metadata");

        PANEL.html("");
        //   PANEL.append("h6").text(result.location);

        Object.entries(result).forEach(([key, value]) => {
            PANEL.append("h6").text(key.toUpperCase() + ': ' + value);
        })
    });

    //id, ethnicity, genger, age, location, bbtype, wfreq
}

function buildCharts(sample) {
    d3.json("samples.json").then((data) => {
        var resultArray = data
            .samples
            .filter(sampleObj => {
                return sampleObj.id == sample
            });

        var result = resultArray[0];

        var top_ten_otu_ids = result.otu_ids.slice(0, 10).map(numericIds => {
            return 'OTU' + numericIds;
        }).reverse();

        var top_ten_sample_values = result.sample_values.slice(0, 10).reverse();
        var top_ten_otu_labels = result.otu_labels.slice(0, 10).reverse();

        //plotting
        var bar_trace = [
            {
                x: top_ten_sample_values, //top_ten_otu_labels, 
                y: top_ten_otu_ids,
                type: 'bar',
                orientation: 'h'
            }
        ];

        var otu_ids = result.otu_ids.map(numericIds => {
            return 'OTU' + numericIds;
        });

        var sample_values = result.sample_values;

        var bar_layout = {};
        Plotly.newPlot(
            'bar', // 1) Where to put the plot; the string with the value of the id where you want the plot to go (no # needed)
            bar_trace, //data
            bar_layout //optional
        )


        var bubble_trace = [
            {
                x: otu_ids,
                y: sample_values,
                mode: 'markers',
                marker: {
                    color: otu_ids,
                    size: sample_values
                    //color:  
                }
            }
        ];


        var bubble_layout = {};

        Plotly.newPlot(
            'bubble', // 1) Where to put the plot; the string with the value of the id where you want the plot to go (no # needed)
            bubble_trace, // 2) The "trace" ; the data
            bubble_layout // 3) The "layout"; the metadata / configuration / prettiness <-- optional
        )

         var wfreq = result.wfreq.map(numericIds => {
             return 'wfreq' + numericIds;
         });

        var guage_trace = [
            {
              domain: { x: [0, 1], y: [0, 1] },
              value: wfreq,
              title: { text: "Belly Button Washing Frequency" },
              type: "indicator",
              mode: "gauge+number",
              //delta: { reference: 380 },
              gauge: {
                axis: { range: [null, 9] },
                steps: [
                  { range: [0, 2], color: "white" },
                  { range: [2, 4], color: "lightgray" },
                  { range: [4, 6], color: "lightgray" },
                  { range: [6, 8], color: "lightgray" },
                  { range: [8, 9], color: "lightgray" }
                ],
                threshold: {
                  line: { color: "red", width: 4 },
                  thickness: 0.75,
                  value: wfreq
                }
              }
            }
          ];
        // var guage_trace = [
        //     {
        //         domain: { x: [0, 1], y: [0, 1] },
        //         value: wfreq,
        //         title: { text: "Speed" },
        //         type: "indicator",
        //         mode: "gauge+number"
        //     }
        // ];

        var guage_layout = {};

        Plotly.newPlot(
            'guage', // 1) Where to put the plot; the string with the value of the id where you want the plot to go (no # needed)
            guage_trace, // 2) The "trace" ; the data
            guage_layout // 3) The "layout"; the metadata / configuration / prettiness <-- optional
        )
    })
}


init();  
