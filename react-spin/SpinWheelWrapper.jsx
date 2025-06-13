import React, { useState, useEffect, useRef, useImperativeHandle } from 'react';
import { loadFonts, loadImages } from './scripts/util.js';
import { props as wheelPropsData } from './js/props.js';
import { Wheel } from 'spin-wheel';

// Helper function to initialize images within props objects
function initImage(obj, pName) {
  if (!obj || !obj[pName] || typeof obj[pName] !== 'string') return null;
  const i = new Image();
  i.src = obj[pName];
  obj[pName] = i;
  return i;
}

// Find the index of the 'Movies' props
const moviesPropsIndex = wheelPropsData.findIndex((p) => p.name === 'Movies');
// Fallback to index 0 if 'Movies' is not found, though it should be present based on props.js
const initialPropIndex = moviesPropsIndex !== -1 ? moviesPropsIndex : 0;

const SpinWheelWrapper = React.forwardRef(({ data }, ref) => {
  const wheelContainerRef = useRef(null);
  const wheelRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  React.useImperativeHandle(ref, () => ({
    handleSpinClick,
  }));

  // Effect for initial loading of assets and wheel setup
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const loadAssets = async () => {
      try {
        // 1. Load Fonts
        const fontsToLoad = wheelPropsData.map((p) => p.itemLabelFont).filter(Boolean); // Get unique font names
        await loadFonts(fontsToLoad);

        // 2. Prepare and Load Images
        const imagesToLoad = [];
        const processedProps = JSON.parse(JSON.stringify(wheelPropsData)); // Deep clone to avoid modifying original props

        processedProps.forEach((p) => {
          imagesToLoad.push(initImage(p, 'image'));
          imagesToLoad.push(initImage(p, 'overlayImage'));
          // if (p.items) {
          //   p.items.forEach((item) => {
          //     imagesToLoad.push(initImage(item, 'image'));
          //   });
          // }
        });

        await loadImages(imagesToLoad.filter(Boolean)); // Load only valid image objects

        if (isMounted) {
          // 3. Initialize Wheel after assets are loaded using the hardcoded index
          if (wheelContainerRef.current) {
            const initialProps = processedProps[initialPropIndex]; // Use hardcoded index
            wheelRef.current = new Wheel(wheelContainerRef.current);
            wheelRef.current.init({ ...initialProps, items: data });
            // Save globally for debugging if needed (optional)
            // window.wheel = wheelRef.current;
          }
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error loading assets or initializing wheel:', error);
        if (isMounted) setIsLoading(false); // Stop loading even if there's an error
      }
    };

    loadAssets();

    // Cleanup function
    return () => {
      isMounted = false;
      if (wheelRef.current) {
        // wheelRef.current?.destroy();
        wheelRef.current = null;
      }
    };
  }, []);

  const handleSpinClick = (winningItemIndex = 0, callback) => {
    if (wheelRef.current && !wheelRef.current.isSpinning) {
      const spinDirection = 1;
      const easingFunction = null;
      const revolutions = 4;
      const duration = 2600;
      wheelRef.current.spinToItem(
        winningItemIndex,
        duration,
        false,
        revolutions,
        spinDirection,
        easingFunction,
      );

      // Set a timeout to call the callback after the spin duration
      setTimeout(() => {
        callback(winningItemIndex);
      }, duration + 100); // Add a small delay to ensure the spin is complete
    }
  };

  return (
    <div style={{ width: '100%', height: '50vh', marginTop: '-30px' }}>
      {isLoading && <p>Loading Wheel...</p>}

      {/* Container for the wheel canvas */}
      <div
        ref={wheelContainerRef}
        className="wheel-wrapper"
        style={{
          visibility: isLoading ? 'hidden' : 'visible',
          width: '100%',
          height: '100%',
        }}
      ></div>
    </div>
  );
});

export default SpinWheelWrapper;
