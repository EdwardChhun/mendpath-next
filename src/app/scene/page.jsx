"use client"
import Head from 'next/head';
import { useEffect } from 'react';

export default function ARPage() {
  useEffect(() => {
    // Ensure this runs after component mounts (if needed)
  }, []);

  return (
    <>
      <Head>
        <meta aframe-injected name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,shrink-to-fit=no,user-scalable=no,minimal-ui,viewport-fit=cover" />
        <meta aframe-injected name="mobile-web-app-capable" content="yes"/>
        <script src="https://aframe.io/releases/1.3.0/aframe.min.js"></script>
        <script src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js"></script>
      </Head>

      <div style={{ margin: 0, overflow: 'hidden' }}>
        <a-scene embedded arjs>
          <a-marker preset="hiro">
           <a-entity
            position="0 0 0"
            scale="0.05 0.05 0.05"
            geometry="primitive: box"
            ></a-entity>
          </a-marker>
          <a-entity camera></a-entity>
          <canvas className="a-canvas" data-aframe-canvas="true" data-engine="three.js r137" width={960} height={720}></canvas>
          <a-entity light data-aframe-default-light></a-entity>
          <a-entity light position data-aframe-default-light aframe-injected></a-entity>
        </a-scene>
        <video id="arjs-video" autoPlay muted playsInline style={{width:960, height: 720, position: 'absolute', top: 0, left: 0, zIndex: -2, marginLeft: 0, marginTop: -253}}></video>
      </div>
    </>
  );
}