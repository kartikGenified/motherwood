import Matter from 'matter-js';
import React, { useEffect } from 'react';
import { Dimensions, Image, View } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const Pipe = ({ body }) => {
    const width = body.bounds.max.x - body.bounds.min.x;
    const height = body.bounds.max.y - body.bounds.min.y;
    const xPos = body.position.x - width / 2;
    const yPos = body.position.y - height / 2;

    return (
        <View
            style={{
                position: 'absolute',
                left: xPos,
                top: yPos,
                width: width,
                height: height,
                zIndex: 10, // Keep pipes above other elements
                elevation: 10, // For Android
            }}
        >
            <Image
                source={require('../../../../assets/images/pipe-red.png')}
                style={{
                    width: '100%',
                    height: '100%',
                    resizeMode: 'stretch',
                    transform: [{ scaleY: body.isTop ? -1 : 1 }]
                }}
                onError={(error) => console.error('Pipe image failed to load:', error.nativeEvent.error)}
            />
        </View>
    );
};

export default Pipe;