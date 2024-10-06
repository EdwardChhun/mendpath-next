"use client"
import Head from 'next/head';
import { useEffect, useState } from "react";
import ReactDOM from "react-dom"
import React from "react"
import "@ar-js-org/ar.js";

export default function ARScene() {
  const [markerSeen, setMarkerSeen] = useState(false);
  useEffect(() => {
    const marker = document.querySelector('a-marker');
    marker.addEventListener('markerFound', () => {
      setMarkerSeen(true);
    });
    marker.addEventListener('markerLost', () => {
      console.log('marker lost');
    });

    return () => {
      marker.removeEventListener('markerFound', () => setMarkerSeen(true));
      marker.removeEventListener('markerLost', () => console.log('marker lost'));
    };
  }, []);
  return (
    <>
      <Head>
        <meta aframe-injected name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,shrink-to-fit=no,user-scalable=no,minimal-ui,viewport-fit=cover" />
        <meta aframe-injected name="mobile-web-app-capable" content="yes"/>
        <script src="https://aframe.io/releases/0.9.2/aframe.min.js"></script>
        <script src="https://cdn.rawgit.com/jeromeetienne/AR.js/1.6.2/aframe/build/aframe-ar.js"></script>
      </Head>
      
      <body style={{ margin: 0, overflow: 'hidden' }}>
          <a-scene embedded arjs="sourceType: webcam;">
            <a-assets>
              <a-asset-item
                id="therapist"
                src="/therapist.glb"
              >
              </a-asset-item>
            </a-assets>
            <a-marker preset="hiro">
            {markerSeen && (
              <a-gltf-model
                src="#therapist"
                rotation="0 -90 90"
                scale="0.25 0.25 0.25"
              ></a-gltf-model>
            )}
          </a-marker>
          <a-entity camera></a-entity>
          </a-scene>
      </body>
      <div id="root"></div>
    </>
  );
}