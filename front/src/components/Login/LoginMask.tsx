import Particles from "react-tsparticles";
import { PolygonMaskType } from "tsparticles";
import transcendence from "./transcendenceSVG.svg";

export default function LoginParticlesTitle() {
  return (
    <Particles
      id="tsparticles"
      options={{
        autoPlay: true,
        background: {
          image:
            "url('https://wallpaperboat.com/wp-content/uploads/2021/10/18/79418/squid-game-04.jpg')",
          position: "center",
        },
        detectRetina: false,
        fullScreen: true,
        interactivity: {
          detectsOn: "canvas",
          events: {
            onHover: {
              enable: true,
              mode: "bubble",
            },
            resize: true,
          },
          modes: {
            bubble: {
              distance: 40,
              duration: 2,
              mix: true,
              opacity: 8,
              size: 3,
            },
          },
        },
        motion: {
          disable: false,
          reduce: {
            factor: 4,
            value: true,
          },
        },
        particles: {
          bounce: {
            horizontal: {
              random: {
                enable: false,
                minimumValue: 0.1,
              },
              value: 1,
            },
            vertical: {
              random: {
                enable: false,
                minimumValue: 0.1,
              },
              value: 1,
            },
          },
          color: {
            value: "#ffffff",
            animation: {
              h: {
                count: 0,
                enable: false,
                offset: 0,
                speed: 1,
                sync: true,
              },
              s: {
                count: 0,
                enable: false,
                offset: 0,
                speed: 1,
                sync: true,
              },
              l: {
                count: 0,
                enable: false,
                offset: 0,
                speed: 1,
                sync: true,
              },
            },
          },
          destroy: {
            split: {
              count: 1,
              factor: {
                random: {
                  enable: false,
                  minimumValue: 0,
                },
                value: 3,
              },
              rate: {
                random: {
                  enable: false,
                  minimumValue: 0,
                },
                value: {
                  min: 4,
                  max: 9,
                },
              },
              sizeOffset: true,
            },
          },
          life: {
            count: 0,
            delay: {
              random: {
                enable: false,
                minimumValue: 0,
              },
              value: 0,
              sync: false,
            },
            duration: {
              random: {
                enable: false,
                minimumValue: 0.0001,
              },
              value: 0,
              sync: false,
            },
          },
          links: {
            blink: false,
            color: {
              value: "#471919",
            },
            consent: false,
            distance: 40,
            enable: true,
            frequency: 1,
            opacity: 0.5,
            shadow: {
              blur: 10,
              color: {
                value: "#bbbfb5",
              },
              enable: true,
            },
            triangles: {
              enable: false,
              frequency: 1,
            },
            width: 1,
            warp: false,
          },
          move: {
            angle: {
              offset: 0,
              value: 90,
            },
            attract: {
              distance: 200,
              enable: false,
              rotate: {
                x: 600,
                y: 1200,
              },
            },
            decay: 0,
            distance: {},
            direction: "none",
            drift: 0,
            enable: true,
            path: {
              clamp: true,
              delay: {
                random: {
                  enable: false,
                  minimumValue: 0,
                },
                value: 0,
              },
              enable: false,
              options: {},
            },
            outModes: {
              default: "bounce",
              bottom: "bounce",
              left: "bounce",
              right: "bounce",
              top: "bounce",
            },
            random: false,
            size: false,
            speed: 0.2,
            spin: {
              acceleration: 0,
              enable: false,
            },
            straight: false,
            trail: {
              enable: false,
              length: 10,
              fillColor: {
                value: "#471919",
              },
            },
            vibrate: false,
            warp: false,
          },
          number: {
            limit: 0,
            value: 200,
          },
          opacity: {
            random: {
              enable: false,
              minimumValue: 0.1,
            },
            value: {
              min: 1,
              max: 5,
            },
            animation: {
              count: 0,
              enable: true,
              speed: 2,
              sync: false,
              destroy: "none",
              startValue: "random",
              minimumValue: 0.05,
            },
          },
          orbit: {
            animation: {
              count: 0,
              enable: false,
              speed: 1,
              sync: false,
            },
            enable: false,
            opacity: 1,
            rotation: {
              random: {
                enable: false,
                minimumValue: 0,
              },
              value: 45,
            },
            width: 1,
          },
          reduceDuplicates: false,
          repulse: {
            random: {
              enable: false,
              minimumValue: 0,
            },
            value: 0,
            enabled: false,
            distance: 1,
            duration: 1,
            factor: 1,
            speed: 1,
          },
          roll: {
            darken: {
              enable: false,
              value: 0,
            },
            enable: false,
            enlighten: {
              enable: false,
              value: 0,
            },
            mode: "vertical",
            speed: 25,
          },
          shape: {
            options: {},
            type: "circle",
          },
          size: {
            random: {
              enable: true,
              minimumValue: 1,
            },
            value: 1,
            animation: {
              count: 0,
              enable: true,
              speed: 40,
              sync: false,
              destroy: "none",
              startValue: "random",
              minimumValue: 0.1,
            },
          },
          stroke: {
            width: 0,
          },
          tilt: {
            random: {
              enable: false,
              minimumValue: 0,
            },
            value: 0,
            animation: {
              enable: false,
              speed: 0,
              sync: false,
            },
            direction: "clockwise",
            enable: false,
          },
          twinkle: {
            lines: {
              enable: false,
              frequency: 0.05,
              opacity: 1,
            },
            particles: {
              enable: false,
              frequency: 0.05,
              opacity: 1,
            },
          },
          wobble: {
            distance: 5,
            enable: false,
            speed: 50,
          },
          zIndex: {
            random: {
              enable: false,
              minimumValue: 0,
            },
            value: 0,
            opacityRate: 1,
            sizeRate: 1,
            velocityRate: 1,
          },
        },
        pauseOnBlur: true,
        pauseOnOutsideViewport: true,
        responsive: [],
        themes: [],
        zLayers: 100,
        polygon: {
          enable: true,
          scale: 1.7,
          type: "inline" as PolygonMaskType,
          url: transcendence,
          position: {
            x: 50,
            y: 10,
          },
          draw: {
            enable: true,
            stroke: {
              color: {
                value: "#471919",
              },
              width: 3,
              opacity: 1,
            },
          },
          inline: {
            arrangement: "equidistant",
          },
          move: {
            radius: 10,
            type: "radius",
          },
        },
      }}
    />
  );
}
