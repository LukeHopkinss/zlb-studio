import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import {Text} from '@react-three/drei'

function Logo({onClick}) {
    const textRef = useRef();
    const [hovered, setHovered] = useState();

    useFrame(() => {
        if(hovered){
            textRef.current.rotation.y = 0;
        }

        else{
            textRef.current.rotation.y += 0.01;
        }
    }
);
    return (
        <Text ref = {textRef}
            font = "/Allura-Regular.ttf"
            fontSize = {1}
            color = {hovered ? 'gray' : 'white'}
            position = {[0,0,0]}
            anchorX = 'center'
            anchorY = "middle" 
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onClick={onClick}
        >
            z
        </Text>
    );
};

export default Logo;