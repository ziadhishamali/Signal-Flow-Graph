    var nodes = [];
    var edges = [];
    var network = null;
    // randomly create some nodes and edges

    function myFunction(x) {
        x.classList.toggle("change");
        if (document.getElementById("sideBar").style.right <= "-300px") {
            document.getElementById("sideBar").style.right = "0px";
            document.getElementById("container").style.right = "30px";
            document.getElementById("allContent").style.right = "300px";
            document.getElementById("moveToTop").style.right = "330px";
        } else {
            document.getElementById("sideBar").style.right = "-300px";
            document.getElementById("sideBarHow").style.right = "-1000px";
            document.getElementById("sideBarAbout").style.right = "-1000px";
            document.getElementById("container").style.right = "30px";
            document.getElementById("allContent").style.right = "0px";
            document.getElementById("moveToTop").style.right = "30px";

            document.getElementById("howBtn").style.borderLeft = "0px";
            document.getElementById("howBtn").style.color = "grey";
            document.getElementById("aboutBtn").style.borderLeft = "0px";
            document.getElementById("aboutBtn").style.color = "grey";
            document.getElementById("homeBtn").style.borderLeft = "3px solid orange";
            document.getElementById("homeBtn").style.color = "black";
        }
    }

    function destroy() {
        if (network !== null) {
            network.destroy();
            network = null;
        }
    }

    function draw() {
        destroy();
        nodes = new vis.DataSet([

        ]);
        edges = new vis.DataSet([

        ]);

        // create a network
        var container = document.getElementById('mynetwork');

        var data = {
            nodes: nodes,
            edges: edges
        };

        var evaluateBtn = document.getElementById("evaluateBtn");
        var resetBtn = document.getElementById("resetBtn");
        var moveToTopBtn = document.getElementById("moveToTop");
        var homeBtn = document.getElementById("homeBtn");
        var howBtn = document.getElementById("howBtn");
        var aboutBtn = document.getElementById("aboutBtn");

        console.log(evaluateBtn);

        evaluateBtn.onclick = function () {
            document.getElementById('html').style.overflow = 'auto';
            document.getElementById('answer').style.display = 'block';
            document.getElementById('output').style.display = 'block';
            document.documentElement.scrollTop = 900;
            console.log("I'm heeeeeeeeeeere !!!!");
            console.log(data);
            console.log("nodes length: " + data.nodes.length);
            console.log("edges length: " + data.edges.length);
            console.log("ids: " + data.nodes.getIds()[0]);
            let arrIds = data.nodes.getIds();
            console.log("node 1 label: " + data.nodes.get(arrIds[0]).label);
            let app = new App();
            app.fillNodes(data.nodes);
            app.fillEdges(data.edges);
            app.calculateForwardPath();
            //app.calculateDelta();
            app.calculateUntouched();
            app.calculateDeltaIndex();
            app.getResult();
        };

        resetBtn.onclick = function () {
            document.getElementById('html').style.overflow = 'auto';
            document.getElementById('answer').style.display = 'none';
            document.getElementById('output').style.display = 'none';
            moveToTopBtn.click();
            destroy();
            draw();
        };

        window.onscroll = function () {
            if (document.body.scrollTop > 150 || document.documentElement.scrollTop > 150) {
                document.getElementById("moveToTop").style.display = "block";
            } else {
                document.getElementById("moveToTop").style.display = "none";
            }
        };

        moveToTopBtn.onclick = function () {

            document.documentElement.scrollTop = 0;

        };

        homeBtn.onclick = function () {
            document.getElementById("container").click();
        };

        howBtn.onclick = function () {
            document.getElementById("container").style.right = "30px";
            document.getElementById("allContent").style.right = "1300px";
            document.getElementById("moveToTop").style.right = "1330px";
            document.getElementById("sideBarHow").style.right = "0px";
            document.getElementById("sideBar").style.right = "1000px";
            document.getElementById("sideBarAbout").style.right = "-1000px";
            homeBtn.style.borderLeft = "0px";
            homeBtn.style.color = "grey";
            aboutBtn.style.borderLeft = "0px";
            aboutBtn.style.color = "grey";
            howBtn.style.borderLeft = "3px solid orange";
            howBtn.style.color = "black";
        };

        aboutBtn.onclick = function () {
            document.getElementById("container").style.right = "30px";
            document.getElementById("allContent").style.right = "1300px";
            document.getElementById("moveToTop").style.right = "1330px";
            document.getElementById("sideBarAbout").style.right = "0px";
            document.getElementById("sideBar").style.right = "1000px";
            document.getElementById("sideBarHow").style.right = "-1000px";
            homeBtn.style.borderLeft = "0px";
            homeBtn.style.color = "grey";
            howBtn.style.borderLeft = "0px";
            howBtn.style.color = "grey";
            aboutBtn.style.borderLeft = "3px solid orange";
            aboutBtn.style.color = "black";
        };

        var options = {

            nodes: {
                color: {background: 'white', border: 'orange', hover: {background: 'white', border: 'orangered'}, highlight: {background: 'white', border: 'orangered'}},
                shape: 'circle',
                borderWidth: 2,
                size: 25
            },

            edges: {
                arrows: 'to',
                font: '12px Berlin Sans FP grey',
                font: {align: 'top'},
                shadow: true,
                smooth: {
                    enabled: true, //setting to true enables curved lines
                    //type: "dynamic",
                    //roundness: 0.5
                },
            },

            interaction: {
                navigationButtons: true,
                hover: true,
            },

            manipulation: {

                addNode: function (data, callback) {
                    // filling in the popup DOM elements
                    console.log("add node: " + data);
                    document.getElementById('node-operation').innerHTML = "Add Node";
                    editNode(data, clearNodePopUp, callback);
                },

                editNode: function (data, callback) {
                    // filling in the popup DOM elements
                    document.getElementById('node-operation').innerHTML = "Edit Node";
                    editNode(data, cancelNodeEdit, callback);
                },

                addEdge: function (data, callback) {
                    console.log("add edge: " + data.label);
                    if (data.from == data.to) {
                        var r = confirm("Do you want to connect the node to itself?");
                        if (r != true) {
                            callback(null);
                            return;
                        }
                    }
                    document.getElementById('edge-operation').innerHTML = "Add Edge";
                    editEdgeWithoutDrag(data, callback);
                },

                editEdge: {
                    editWithoutDrag: function(data, callback) {
                        document.getElementById('edge-operation').innerHTML = "Edit Edge";
                        editEdgeWithoutDrag(data,callback);
                    }
                }

            },

            physics: {
                forceAtlas2Based: {
                    gravitationalConstant: -26,
                    centralGravity: 0.005,
                    springLength: 230,
                    springConstant: 0.18,
                    avoidOverlap: 1.5
                },
                maxVelocity: 146,
                solver: 'forceAtlas2Based',
                timestep: 0.35,
                stabilization: {
                    enabled: true,
                    iterations: 1000,
                    updateInterval: 25
                }
            }
        };

        network = new vis.Network(container, data, options);

        network.on("stabilizationIterationsDone", function () {
            network.setOptions( { physics: true } );
        });

    }

    function editNode(data, cancelAction, callback) {
        (document).onkeydown = function(e) {
            if (e.key === 'Enter') {
                document.getElementById('node-saveButton').click();
                document.getElementById('edge-saveButton').click();
            } else if (e.key === 'Escape') {
                document.getElementById('node-cancelButton').click();
                document.getElementById('edge-cancelButton').click();
            }
        };

        document.getElementById('node-label').value = data.label;
        document.getElementById('node-saveButton').onclick = saveNodeData.bind(this, data, callback);
        document.getElementById('node-cancelButton').onclick = cancelAction.bind(this, callback);
        document.getElementById('node-popUp').style.display = 'block';
        document.getElementById('node-label').focus();
        document.getElementById('node-label').select();
    }

    // Callback passed as parameter is ignored
    function clearNodePopUp() {
        document.getElementById('node-saveButton').onclick = null;
        document.getElementById('node-cancelButton').onclick = null;
        document.getElementById('node-popUp').style.display = 'none';
    }

    function cancelNodeEdit(callback) {
        clearNodePopUp();
        callback(null);
        network.addNodeMode();
    }

    function saveNodeData(data, callback) {
        data.label = document.getElementById('node-label').value;
        clearNodePopUp();
        /*if (nodes.length === 0) {
            data.color = {background: 'orange', border: 'white', hover: {background: 'orange', border: 'grey'}, highlight: {background: 'orangered', border: 'orange'}};
            data.font = {color: 'white'};
        }*/
        callback(data);
        let arrIds = nodes.getIds();
        console.log("arrIds: " + arrIds.length);

        for (let i = 0; i < arrIds.length; i++) {
            if (i === 0) {
                var clickedNode = nodes.get(arrIds[i]);
                clickedNode.color = {background: 'orange', border: 'white', hover: {background: 'orange', border: 'grey'}, highlight: {background: 'orangered', border: 'orange'}};
                clickedNode.font = {color: 'white'};
                nodes.update(clickedNode);
            } else if (i === arrIds.length - 1) {
                var clickedNode = nodes.get(arrIds[i]);
                clickedNode.color = {background: 'white', border: 'black', hover: {background: 'white', border: 'darkgrey'}, highlight: {background: 'white', border: 'grey'}};
                clickedNode.font = {color: 'black'};
                nodes.update(clickedNode);
            } else {
                var clickedNode = nodes.get(arrIds[i]);
                clickedNode.color = {background: 'white', border: 'orange', hover: {background: 'white', border: 'orangered'}, highlight: {background: 'white', border: 'orangered'}};
                clickedNode.font = {color: 'black'};
                nodes.update(clickedNode);
            }
        }
        network.addNodeMode();
    }

    function editEdgeWithoutDrag(data, callback) {
        // filling in the popup DOM elements
        document.getElementById('edge-label').value = data.label;
        document.getElementById('edge-saveButton').onclick = saveEdgeData.bind(this, data, callback);
        document.getElementById('edge-cancelButton').onclick = cancelEdgeEdit.bind(this,callback);
        document.getElementById('edge-popUp').style.display = 'block';
        document.getElementById('edge-label').focus();
        document.getElementById('edge-label').select();
    }

    function clearEdgePopUp() {
        document.getElementById('edge-saveButton').onclick = null;
        document.getElementById('edge-cancelButton').onclick = null;
        document.getElementById('edge-popUp').style.display = 'none';
    }

    function cancelEdgeEdit(callback) {
        clearEdgePopUp();
        callback(null);
        network.addEdgeMode();
    }

    function saveEdgeData(data, callback) {
        if (typeof data.to === 'object')
            data.to = data.to.id
        if (typeof data.from === 'object')
            data.from = data.from.id
        data.label = document.getElementById('edge-label').value;
        console.log(data.label);
        clearEdgePopUp();
        callback(data);
        network.addEdgeMode();
    }

    function init() {
        draw();
        document.documentElement.scrollTop = 0;
    }
