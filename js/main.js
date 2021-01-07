/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, window, location, CSInterface, SystemPath, themeManager*/

(function () {
    'use strict';

    var csInterface = new CSInterface();
    var logFlag = false;

    function init() {
                
        themeManager.init();
                
        $("#btn_histogram").click(function () {
            csInterface.evalScript(`showHistogram()`, (o)=>{
                $("#toggle_log10").prop('disabled', false);
                var hist = o.split(',').map(Number);
                var labels = [...Array(hist.length)].map((_, i) => i);
                if (logFlag) {
                    var scaleType = 'logarithmic';
                } else {
                    var scaleType = 'linear';
                }
                if (window.myChart instanceof Chart) {
                    window.myChart.destroy();
                }
                window.myChart = new Chart($("#chart_histogram"), {
                    type: 'bar',
                    data:{
                        labels: labels,
                        datasets: [
                        {
                            label: 'Saturation',
                            data: hist,
                            pointRadius: 0,                   
                            backgroundColor: "rgba(255,255,255,1)"
                        }
                        ],
                    },
                    options: {
                        legend: {
                            labels: {
                                fontColor: "white"
                            }
                        },
                        title: {
                            display: true,
                            fontColor: "white",
                            text: 'Histogram'
                        },
                        scales: {
                            yAxes: [{
                                type: scaleType,
                                ticks: {
                                    fontColor: "white",
                                    suggestedMin: 0
                                }
                            }], 
                            xAxes: [{
                                ticks: {
                                    fontColor: "white"
                                }
                            }]
                        },
                        animation: {
                            duration: 0
                        }
                    }
                });
            });
        });

        $("#toggle_log10").change(function () {
            logFlag = !logFlag;
            if (logFlag) {
                var scaleType = 'logarithmic';
            } else {
                var scaleType = 'linear';
            }
            window.myChart.options.scales.yAxes[0] = {
                type: scaleType,
                ticks: {
                    fontColor: "white",
                    suggestedMin: 0
                }
            }
            window.myChart.update();
        });
    }
        
    init();


}());
    
