
window.CITYMESH3R_DATA = {
  theme: {
    default: "dark",          // "dark" or "light"
    rememberChoice: true
  },

  analytics: {
    enabled: false,
    googleTagId: "G-XXXXXXXXXX"
  },

  nav: {
    brand: "City-Mesh3R",
    abstract: "Abstract",
    method: "Method",
    videos: "Videos",
    images: "Images",
    results: "Results",
    bibtex: "BibTeX"
  },

  paper: {
    titleHtml: "<span>City-Mesh3R</span>: Simulation-Ready City-Scale 3D Mesh Reconstruction from Multi-View Images",
    shortTitle: "City-Mesh3R",
    affiliations: ["Visual Computing & Embodied AI Lab, TCS Research, India"],
    venue: {
      text: "Accepted to the USM3D Workshop Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR) 2026",
      href: "https://usm3d.github.io/"
    },
    links: [
      { label: "Paper", icon: "ai ai-arxiv", href: "https://arxiv.org/abs/2605.30310" },
      { label: "Qualitative Images", icon: "fas fa-image", href: "#image-comparisons" },
      { label: "Qualitative Videos", icon: "fas fa-play", href: "#videos" },
      { label: "BibTeX", icon: "fas fa-quote-right", href: "#bibtex" }
      
    ]
  },

  authors: [
    { name: "Sayan Paul", href: "" },
    { name: "Sourav Ghosh", href: "" },
    { name: "Siddharth Katageri", href: "" },
    { name: "Soumyadip Maity", href: "" },
    { name: "Sanjana Sinha", href: "" },
    { name: "Brojeshwar Bhowmick", href: "" }
  ],

  headings: {
    abstract: { title: "Abstract" },
    contributions: {
      title: "Key Ideas",
      text: "A distributed sparse-to-dense pipeline designed for scalable, explicit, simulation-ready city meshes."
    },
    method: {
      title: "Pipeline Overview",
    },
    areaVisualizer: {
      title: "Area-Partitioning and Camera Selection Visualizer",
      text: "A behind-the-scenes visualization of spatial partitioning of sparse-SFM followed by top-M camera selection."
    },
    largeScaleVideos: {
      title: "Large-Scale 3D Reconstruction Qualitative Comparisons",
      text: "Interactive sliders compare City-Mesh3R against other state-of-the-art methods : CityGS-v2 and CityGS-X."
    },
    cameraWalkthrough: {
      title: "Camera Walkthrough based Mesh Comparisons",
      text: "Choose a scene. On wide screens, CityGS-v2 and CityGS-X comparisons are shown side-by-side with locked sliders and synchronized playback. On narrow mobile screens, comparison against only one baseline method is shown at a time and needs to be selected from dropdown."
    },
    lightStress: {
      title: "Revolving Light Source based Mesh Comparison",
      text: "Stationary-camera videos with a moving light source expose surface irregularities and geometric artifacts. On wide screens, CityGS-v2 and CityGS-X comparisons are shown side-by-side with locked sliders and synchronized playback. On narrow mobile screens, comparison against only one baseline method is shown at a time and needs to be selected from dropdown."
    },
    paperQualitative: {
      title: "Qualitative Image Comparisons",
      text: "Choose a scene and viewpoint. Mesh and normal renders are stacked by row; CityGS-v2 and CityGS-X comparisons appear side-by-side on wide screens. And on narrow mobile screens, comparision method needs to be selected from dropdown."
    },
    garden: {
      title: "Small-Scale 3D Reconstruction Qualitative Comparison",
      text: "Interactive sliders compare City-Mesh3R against small-scale reconstruction methods. Mesh and normal renders are displayed side-by-side format on widescreen devices. And on narrow mobile screens, they are displayed in a vertically stacked format."
    },
    results: {
      title: "Quantitative Results",
      text: ""
    },
    applications: {
      title: "Why simulation-ready meshes?",
      text: "Explicit good quality meshes are practical assets for physics-based simulations, not just novel view rendering representations."
    },
    bibtex: {
      title: "BibTeX",
      text: "If you find this work useful, please cite it."
    }
  },

  abstractTldr: "City-Mesh3R reconstructs explicit, watertight, simulation-ready city-scale meshes from unordered multi-view images. It scales through distributed sparse-to-dense reconstruction, geometry-aware partitioning, and adaptive remeshing, producing cleaner geometry and normals than large-scale GS-based mesh extraction baselines.",

  abstractUi: {
    collapsedByDefault: true,
    previewParagraphs: 1,
    readMoreLabel: "Read full abstract",
    showLessLabel: "Show less"
  },

  abstract: [
    "City-scale 3D surface reconstruction from multiview images for downstream 3D simulation, poses highly challenging problems due to the scale and complexity of urban scenes. Existing city-scale 3D reconstruction methods based on NeRF, Gaussian Splatting etc. often fail to recover 3D meshes ready for simulation due to incomplete/missing geometry and irregular, noisy surfaces. Scaling existing small-scale 3D reconstruction methods to arbitrarily large urban scenes is highly infeasible due to their computational complexity.",
    "We present City-Mesh3R, a scalable framework for reconstructing watertight surface meshes directly from large unordered image collections. Unlike recent methods which use global sparse SfM point-cloud initialization followed by a distributed 3D dense reconstruction of large-scale scenes, our method follows an end-to-end images-to-mesh 3D reconstruction approach using a divide-and-conquer strategy. The sparse city map is reconstructed via topological image clustering, cluster-wise independent sparse SfM and map merging, without need for exhaustive image feature matching.",
    "Then this map is partitioned spatially to perform geometry-aware camera selection, followed by dense surface reconstruction and surface refinement using curvature-aware adaptive vertex density remeshing. These partition meshes are then stitched together to produce the global mesh of the city. The proposed end-to-end framework is evaluated on city-scale reconstruction datasets. As demonstrated by our qualitative and quantitative results, our proposed method yields high-fidelity watertight 3D meshes with regular geometry, capturing fine surface details, and is suitable for scaling to arbitrarily large scenes owing to the end-to-end processing in a distributed setting."
  ],

  assets: {
    teaser: {
      kind: "image",
      src: "static/images/citymesh3r_teaser.png", 
      alt: "City-Mesh3R teaser figure",
      placeholderLabel: "City-Mesh3R teaser figure",
      color: "#0ea5e9",
      caption: "City-Mesh3R reconstructs simulation-ready watertight 3D meshes with high geometric fidelity and smooth surface normals from large-scale multi-view image collections."
    },
    pipeline: {
      kind: "image",
      src: "static/images/citymesh3r_pipeline.png", 
      alt: "City-Mesh3R pipeline overview",
      placeholderLabel: "City-Mesh3R pipeline overview",
      color: "#22c55e",
      caption: "Pipeline: unordered images → overlapping image clusters → cluster-wise SfM and map merging → spatial partitioning and geometry-aware camera selection → dense surface initialization → differentiable mesh refinement with curvature-aware remeshing → mesh stitching."
    }
  },

  contributions: [
    { title: "End-to-end city-scale images-to-mesh", icon: "fa-solid fa-city", text: "A distributed hierarchical sparse-to-dense pipeline for reconstructing high-fidelity watertight meshes from large unordered image collections." },
    { title: "Topological clustering for distributed SfM", icon: "fa-solid fa-diagram-project", text: "Overlapping image communities enable cluster-wise sparse SfM and robust map merging without exhaustive all-pair matching." },
    { title: "Geometry-aware area partitioning for dense reconstruction", icon: "fa-solid fa-border-all", text: "Spatial partitions of the sparse-map and co-visibility-based camera ranking select compact set of informative local views for dense reconstruction." },
    { title: "Curvature-aware adaptive remeshing", icon: "fa-solid fa-wave-square", text: "During mesh refinement, higher vertex density is allocated to geometrically complex regions while flat regions stay coarse, improving stability, memory efficiency and surface accuracy under fixed vertex budget." }
  ],

  applications: [
    { title: "Urban digital twins", icon: "fa-solid fa-building", text: "Explicit meshes are easier to inspect, edit, stream, and integrate into simulation stacks." },
    { title: "Infrastructure monitoring", icon: "fa-solid fa-helmet-safety", text: "Geometry-first reconstruction helps preserve structures needed for analysis and change detection." },
    { title: "Flood and disaster simulation", icon: "fa-solid fa-water", text: "Watertight surfaces provide practical inputs for downstream fluid simulation workflows." },
    { title: "Robotics and autonomy", icon: "fa-solid fa-robot", text: "Simulation-ready city meshes can support map based 3d robot navigation, and can support robot learning in simulation." }
  ],

  mediaDefaults: {
    topLabel: "City-Mesh3R",
    showControls: false,        // can be overridden per widget 
    autoplayOnVisible: true,
    muted: true,
    loop: true,
    resetSliderOnChange: true,
    initialSlider: 0.5,
    wideBreakpointPx: 880,
    
    sliderAnimation: {
      min: 0.1,    // left limit = 20%
      max: 0.9,    // right limit = 80%
      speed: 0.50,  // slider-width units per second
      enabledByDefault: false,
      label: "Animate Slider",
      activeLabel: "Stop Animation"
      }
  },

  videos: {
    baselinesLargeScale: [
      { key: "citygsv2", label: "CityGS-v2", color: "#8b5cf6" },
      { key: "citygsx", label: "CityGS-X", color: "#f97316" }
    ],

    cameraWalkthrough: {
      id: "camera-walkthrough",
      controls: { showControls: false, autoplayOnVisible: true },
      sliderAnimation: { min: 0.1, max: 0.9, speed: 0.50 },
      scenes: [
        {
          id: "residence",
          title: "UrbanScene3D Residence",
          subtitle: "Novel View Camera Trajectory around the City",
          metadata: { Dataset: "UrbanScene3D", Scene: "Residence", "#Images": "2582", Area: "0.1 sq.km."},
          methods: {
            ours: { label: "City-Mesh3R", src: "static/videos/large_scale/residence/ours_walkthrough.mp4", color: "#0ea5e9" },
            citygsv2: { label: "CityGS-v2", src: "static/videos/large_scale/residence/citygsv2_walkthrough.mp4", color: "#8b5cf6" },
            citygsx: { label: "CityGS-X", src: "static/videos/large_scale/residence/citygsx_walkthrough.mp4", color: "#f97316" }
          }
        },
        {
          id: "lfls",
          title: "GauU-Scene LFLS",
          subtitle: "Novel View Camera Trajectory around the City",
          metadata: { Dataset: "GauU-Scene", Scene: "LFLS", "#Images": "1106", Area: "1.467 sq.km." },
          methods: {
            ours: { label: "City-Mesh3R", src: "static/videos/large_scale/lfls/ours_walkthrough.mp4", color: "#14b8a6" },
            citygsv2: { label: "CityGS-v2", src: "static/videos/large_scale/lfls/citygsv2_walkthrough.mp4", color: "#8b5cf6" },
            citygsx: { label: "CityGS-X", src: "static/videos/large_scale/lfls/citygsx_walkthrough.mp4", color: "#f97316" }
          }
        },
        {
          id: "smbu",
          title: "GauU-Scene SMBU",
          subtitle: "Novel View Camera Trajectory around the City (Additional Result)",
          metadata: { Dataset: "GauU-Scene", Scene: "SMBU", "#Images": "563", Area: "0.908 sq.km." },
          methods: {
            ours: { label: "City-Mesh3R", src: "static/videos/large_scale/smbu/ours_walkthrough.mp4", color: "#22c55e" },
            citygsv2: { label: "CityGS-v2", src: "static/videos/large_scale/smbu/citygsv2_walkthrough.mp4", color: "#8b5cf6" },
            citygsx: { label: "CityGS-X", src: "static/videos/large_scale/smbu/citygsx_walkthrough.mp4", color: "#f97316" }
          }
        }
      ]
    },

    lightStress: {
      id: "light-stress",
      controls: { showControls: false, autoplayOnVisible: true },
      scenes: [
        {
          id: "cuhk-lower",
          title: "GauU-Scene CUHK-LOWER",
          subtitle: "Novel View Stationary Camera with Revolving Light Source",
          metadata: { Dataset: "GauU-Scene", Scene: "CUHK-LOWER", "#Images": 670, Area: "1.02 sq.km." },
          methods: {
            ours: { label: "City-Mesh3R", src: "static/videos/large_scale/cuhk_lower/ours_moving_light.mp4", color: "#22c55e" },
            citygsv2: { label: "CityGS-v2", src: "static/videos/large_scale/cuhk_lower/citygsv2_moving_light.mp4", color: "#8b5cf6" },
            citygsx: { label: "CityGS-X", src: "static/videos/large_scale/cuhk_lower/citygsx_moving_light.mp4", color: "#f97316" }
          }
        }
      ]
    },

    garden: {
      id: "garden-dual-sync",
      title: "MipNeRF360 Garden",
      //subtitle: "Synchronized mesh and normal render comparison",
      metadata: { Dataset: "MipNeRF360", Scene: "Garden",},
      controls: { showControls: false, autoplayOnVisible: true },
      ours: {
        label: "City-Mesh3R",
        mesh: { src: "static/videos/garden/ours_mesh.mp4", color: "#0ea5e9" },
        normal: { src: "static/videos/garden/ours_normal.mp4", color: "#0284c7" }
      },
      baselines: [
        {
          key: "milo",
          label: "MiLo",
          mesh: { src: "static/videos/garden/milo_mesh.mp4", color: "#f97316" },
          normal: { src: "static/videos/garden/milo_normal.mp4", color: "#ea580c" }
        },
        {
          key: "meshsplatting",
          label: "MeshSplatting",
          mesh: { src: "static/videos/garden/meshsplatting_mesh.mp4", color: "#8b5cf6" },
          normal: { src: "static/videos/garden/meshsplatting_normal.mp4", color: "#7c3aed" }
        },
        {
          key: "radiancemesh",
          label: "RadianceMesh",
          mesh: { src: "static/videos/garden/radiancemesh_mesh.mp4", color: "#e11d48" },
          normal: { src: "static/videos/garden/radiancemesh_normal.mp4", color: "#be123c" }
        }
      ]
    },

    areaPartitioning: {
      type: "standalone",
      mount: "area-visualizer",
      id: "area-partitioning",
      title: "Area partitioning visualizer",
      subtitle: "This video shows the sparse map of a city being partitioned in a grid, where the current selected partition's points are displayed in orange and the rest of the map is displayed in gray. The candidate camera frustums of the selected partition are shown in yellow and the top-M selected cameras or views are show in blue. Here M = 40 for the current visualization. The points visible by those cameras are highlighted by green, once shown for all candidate cameras and then toggled for only the top-M cameras.",
      enabled: true,
      metadata: {},
      video: {
        src: "static/videos/method/area_partitioning_visualizer.mp4",
        color: "#64748b",
        label: "Area partitioning visualizer"
      },
      controls: { showControls: true, autoplayOnVisible: false, muted: false, loop: true }
    }
  },

  paperQualitative: {
    id: "paper-qualitative",
  
    sliderAnimation: {
      enabledByDefault: true,
    },
    
    baselines: [
      { key: "citygsv2", label: "CityGS-v2", color: "#8b5cf6" },
      { key: "citygsx", label: "CityGS-X", color: "#f97316" }
    ],
    scenes: [
      {
        id: "cuhk-lower",
        title: "CUHK-LOWER",
        metadata: { Dataset: "GauU-Scene", Scene: "CUHK-LOWER", "#Images": 670, Area: "1.02 sq.km." },
        views: [
          {
            id: "view-1",
            label: "View 1",
            renders: {
              mesh: {
                ours: { src: "static/images/qualitative/cuhk_lower/view_01/ours_mesh.png", color: "#22c55e" },
                citygsv2: { src: "static/images/qualitative/cuhk_lower/view_01/citygsv2_mesh.png", color: "#8b5cf6" },
                citygsx: { src: "static/images/qualitative/cuhk_lower/view_01/citygsx_mesh.png", color: "#f97316" }
              },
              normal: {
                ours: { src: "static/images/qualitative/cuhk_lower/view_01/ours_normal.png", color: "#16a34a" },
                citygsv2: { src: "static/images/qualitative/cuhk_lower/view_01/citygsv2_normal.png", color: "#7c3aed" },
                citygsx: { src: "static/images/qualitative/cuhk_lower/view_01/citygsx_normal.png", color: "#ea580c" }
              }
            }
          },
          {
            id: "view-2",
            label: "View 2",
            renders: {
              mesh: {
                ours: { src: "static/images/qualitative/cuhk_lower/view_02/ours_mesh.png", color: "#22c55e" },
                citygsv2: { src: "static/images/qualitative/cuhk_lower/view_02/citygsv2_mesh.png", color: "#8b5cf6" },
                citygsx: { src: "static/images/qualitative/cuhk_lower/view_02/citygsx_mesh.png", color: "#f97316" }
              },
              normal: {
                ours: { src: "static/images/qualitative/cuhk_lower/view_02/ours_normal.png", color: "#16a34a" },
                citygsv2: { src: "static/images/qualitative/cuhk_lower/view_02/citygsv2_normal.png", color: "#7c3aed" },
                citygsx: { src: "static/images/qualitative/cuhk_lower/view_02/citygsx_normal.png", color: "#ea580c" }
              }
            }
          }
        ]
      },
      {
        id: "cuhk_upper",
        title: "CUHK_UPPER",
        metadata: { Dataset: "GauU-Scene", Scene: "CUHK_UPPER", "#Images": 715, Area: "0.923 sq.km."},
        views: [
          {
            id: "view-1",
            label: "View 1",
            renders: {
              mesh: {
                ours: { src: "static/images/qualitative/cuhk_upper/view_01/ours_mesh.png", color: "#14b8a6" },
                citygsv2: { src: "static/images/qualitative/cuhk_upper/view_01/citygsv2_mesh.png", color: "#8b5cf6" },
                citygsx: { src: "static/images/qualitative/cuhk_upper/view_01/citygsx_mesh.png", color: "#f97316" }
              },
              normal: {
                ours: { src: "static/images/qualitative/cuhk_upper/view_01/ours_normal.png", color: "#0d9488" },
                citygsv2: { src: "static/images/qualitative/cuhk_upper/view_01/citygsv2_normal.png", color: "#7c3aed" },
                citygsx: { src: "static/images/qualitative/cuhk_upper/view_01/citygsx_normal.png", color: "#ea580c" }
              }
            }
          },
          {
            id: "view-2",
            label: "View 2",
            renders: {
              mesh: {
                ours: { src: "static/images/qualitative/cuhk_upper/view_02/ours_mesh.png", color: "#14b8a6" },
                citygsv2: { src: "static/images/qualitative/cuhk_upper/view_02/citygsv2_mesh.png", color: "#8b5cf6" },
                citygsx: { src: "static/images/qualitative/cuhk_upper/view_02/citygsx_mesh.png", color: "#f97316" }
              },
              normal: {
                ours: { src: "static/images/qualitative/cuhk_upper/view_02/ours_normal.png", color: "#0d9488" },
                citygsv2: { src: "static/images/qualitative/cuhk_upper/view_02/citygsv2_normal.png", color: "#7c3aed" },
                citygsx: { src: "static/images/qualitative/cuhk_upper/view_02/citygsx_normal.png", color: "#ea580c" }
              }
            }
          }
        ]
      },

      

      {
        id: "sziit",
        title: "SZIIT",
        metadata: { Dataset: "GauU-Scene", Scene: "SZIIT", "#Images": 1215, Area: "1.557 sq.km." },
        views: [
          {
            id: "view-1",
            label: "View 1",
            renders: {
              mesh: {
                ours: { src: "static/images/qualitative/sziit/view_01/ours_mesh.png", color: "#22c55e" },
                citygsv2: { src: "static/images/qualitative/sziit/view_01/citygsv2_mesh.png", color: "#8b5cf6" },
                citygsx: { src: "static/images/qualitative/sziit/view_01/citygsx_mesh.png", color: "#f97316" }
              },
              normal: {
                ours: { src: "static/images/qualitative/sziit/view_01/ours_normal.png", color: "#16a34a" },
                citygsv2: { src: "static/images/qualitative/sziit/view_01/citygsv2_normal.png", color: "#7c3aed" },
                citygsx: { src: "static/images/qualitative/sziit/view_01/citygsx_normal.png", color: "#ea580c" }
              }
            }
          },
          {
            id: "view-2",
            label: "View 2",
            renders: {
              mesh: {
                ours: { src: "static/images/qualitative/sziit/view_02/ours_mesh.png", color: "#22c55e" },
                citygsv2: { src: "static/images/qualitative/sziit/view_02/citygsv2_mesh.png", color: "#8b5cf6" },
                citygsx: { src: "static/images/qualitative/sziit/view_02/citygsx_mesh.png", color: "#f97316" }
              },
              normal: {
                ours: { src: "static/images/qualitative/sziit/view_02/ours_normal.png", color: "#16a34a" },
                citygsv2: { src: "static/images/qualitative/sziit/view_02/citygsv2_normal.png", color: "#7c3aed" },
                citygsx: { src: "static/images/qualitative/sziit/view_02/citygsx_normal.png", color: "#ea580c" }
              }
            }
          }
        ]
      },
      
      {
        id: "residence",
        title: "Residence",
        metadata: { Dataset: "UrbanScene3D", Scene: "Residence", "#Images": "2582", Area: "0.1 sq.km."},
        views: [
          {
            id: "view-1",
            label: "View 1",
            renders: {
              mesh: {
                ours: { src: "static/images/qualitative/residence/view_01/ours_mesh.png", color: "#0ea5e9" },
                citygsv2: { src: "static/images/qualitative/residence/view_01/citygsv2_mesh.png", color: "#8b5cf6" },
                citygsx: { src: "static/images/qualitative/residence/view_01/citygsx_mesh.png", color: "#f97316" }
              },
              normal: {
                ours: { src: "static/images/qualitative/residence/view_01/ours_normal.png", color: "#0284c7" },
                citygsv2: { src: "static/images/qualitative/residence/view_01/citygsv2_normal.png", color: "#7c3aed" },
                citygsx: { src: "static/images/qualitative/residence/view_01/citygsx_normal.png", color: "#ea580c" }
              }
            }
          }
        ]
      },

      
    ]
  },

  tables: [
  {
    title: "Surface Reconstruction on GauU-Scene Dataset",
    note: "Surface reconstruction quality evaluated against GT LiDAR data and runtime comparison on GauU-Scene scenes. Best and second-best values are highlighted per scene and metric.",
    columns: ["Scene", "Method", "Precision ↑", "Recall ↑", "F1 ↑", "Time (min) ↓"],
    rows: [
      [
        { text: "CUHK-LOWER" },
        { text: "CityGS-v2" },
        { text: "0.1312" },
        { text: "0.0820", rank: "second" },
        { text: "0.1009", rank: "second" },
        { text: "340.90" }
      ],
      [
        { text: "CUHK-LOWER" },
        { text: "CityGS-X" },
        { text: "0.1327", rank: "second" },
        { text: "0.0758" },
        { text: "0.0965" },
        { text: "75.00", rank: "best" }
      ],
      [
        { text: "CUHK-LOWER" },
        { text: "City-Mesh3R", className: "ours-cell" },
        { text: "0.1420", rank: "best" },
        { text: "0.0910", rank: "best" },
        { text: "0.1110", rank: "best" },
        { text: "95.00", rank: "second" }
      ],

      [
        { text: "LFLS" },
        { text: "CityGS-v2" },
        { text: "0.0901" },
        { text: "0.0666", rank: "second" },
        { text: "0.0791", rank: "second" },
        { text: "296.90" }
      ],
      [
        { text: "LFLS" },
        { text: "CityGS-X" },
        { text: "0.0978", rank: "best" },
        { text: "0.0599" },
        { text: "0.0743" },
        { text: "87.00", rank: "second" }
      ],
      [
        { text: "LFLS" },
        { text: "City-Mesh3R", className: "ours-cell" },
        { text: "0.0951", rank: "second" },
        { text: "0.0777", rank: "best" },
        { text: "0.0855", rank: "best" },
        { text: "83.00", rank: "best" }
      ],

      [
        { text: "SZIIT" },
        { text: "CityGS-v2" },
        { text: "0.1513" },
        { text: "0.0488" },
        { text: "0.0738" },
        { text: "299.07" }
      ],
      [
        { text: "SZIIT" },
        { text: "CityGS-X" },
        { text: "0.1849", rank: "second" },
        { text: "0.0538", rank: "second" },
        { text: "0.0833", rank: "second" },
        { text: "94.00", rank: "second" }
      ],
      [
        { text: "SZIIT" },
        { text: "City-Mesh3R", className: "ours-cell" },
        { text: "0.1925", rank: "best" },
        { text: "0.0647", rank: "best" },
        { text: "0.0968", rank: "best" },
        { text: "92.00", rank: "best" }
      ]
    ]
  },
  {
    title: "Image-to-SfM Sub-Pipeline Efficiency",
    note: "Comparison of our topological clustering-based SfM against all-images-at-once SFM pipelines.",
    columns: ["Method", "Time (hrs) ↓", "2D Reproj. Err. (px) ↓"],
    rows: [
      [
        { text: "MASt3R-COLMAP (all images)" },
        { text: "53.88" },
        { text: "1.17", rank: "best" }
      ],
      [
        { text: "MASt3R-GLOMAP (all images)" },
        { text: "19.45", rank: "second" },
        { text: "1.856" }
      ],
      [
        { text: "City-Mesh3R (SLPA Clustering + MASt3R-COLMAP per cluster)", className: "ours-cell" },
        { text: "2.74", rank: "best" },
        { text: "1.38", rank: "second" }
      ]
    ]
  }
],

  bibtex: `@misc{paul2026citymesh3rsimulationreadycityscale3d,
      title={City-Mesh3R: Simulation-Ready City-Scale 3D Mesh Reconstruction from Multi-View Images}, 
      author={Sayan Paul and Sourav Ghosh and Siddharth Katageri and Soumyadip Maity and Sanjana Sinha and Brojeshwar Bhowmick},
      year={2026},
      eprint={2605.30310},
      archivePrefix={arXiv},
      primaryClass={cs.CV},
      url={https://arxiv.org/abs/2605.30310}, 
}`,

  footer: "This website has been crafted with ♥️ by us, inspired from academic project pages of CityGS-v2 and CityGS-X."
};
