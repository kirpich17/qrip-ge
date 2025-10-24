"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { Button } from './button';

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  title?: string;
}

interface TouchState {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  isDragging: boolean;
  isZooming: boolean;
  initialDistance: number;
  initialScale: number;
}

export const Lightbox: React.FC<LightboxProps> = ({
  isOpen,
  onClose,
  images,
  currentIndex,
  onIndexChange,
  title
}) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [touchState, setTouchState] = useState<TouchState>({
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    isDragging: false,
    isZooming: false,
    initialDistance: 0,
    initialScale: 1
  });

  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset transformations when image changes
  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setRotation(0);
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (images.length > 1) {
            onIndexChange((currentIndex - 1 + images.length) % images.length);
          }
          break;
        case 'ArrowRight':
          if (images.length > 1) {
            onIndexChange((currentIndex + 1) % images.length);
          }
          break;
        case '+':
        case '=':
          e.preventDefault();
          setScale(prev => Math.min(prev * 1.2, 5));
          break;
        case '-':
          e.preventDefault();
          setScale(prev => Math.max(prev / 1.2, 0.1));
          break;
        case '0':
          e.preventDefault();
          setScale(1);
          setPosition({ x: 0, y: 0 });
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          setRotation(prev => prev + 90);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length, onClose, onIndexChange]);

  // Touch event handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      // Single touch - dragging
      setTouchState(prev => ({
        ...prev,
        startX: e.touches[0].clientX,
        startY: e.touches[0].clientY,
        currentX: e.touches[0].clientX,
        currentY: e.touches[0].clientY,
        isDragging: true,
        isZooming: false
      }));
    } else if (e.touches.length === 2) {
      // Two touches - zooming
      const distance = Math.sqrt(
        Math.pow(e.touches[0].clientX - e.touches[1].clientX, 2) +
        Math.pow(e.touches[0].clientY - e.touches[1].clientY, 2)
      );
      setTouchState(prev => ({
        ...prev,
        initialDistance: distance,
        initialScale: scale,
        isDragging: false,
        isZooming: true
      }));
    }
  }, [scale]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    
    if (e.touches.length === 1 && touchState.isDragging) {
      const deltaX = e.touches[0].clientX - touchState.startX;
      const deltaY = e.touches[0].clientY - touchState.startY;
      
      setPosition(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      setTouchState(prev => ({
        ...prev,
        startX: e.touches[0].clientX,
        startY: e.touches[0].clientY
      }));
    } else if (e.touches.length === 2 && touchState.isZooming) {
      const distance = Math.sqrt(
        Math.pow(e.touches[0].clientX - e.touches[1].clientX, 2) +
        Math.pow(e.touches[0].clientY - e.touches[1].clientY, 2)
      );
      
      const scaleChange = distance / touchState.initialDistance;
      const newScale = touchState.initialScale * scaleChange;
      
      setScale(Math.max(0.1, Math.min(5, newScale)));
    }
  }, [touchState]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 0) {
      setTouchState(prev => ({
        ...prev,
        isDragging: false,
        isZooming: false
      }));
    }
  }, []);

  // Mouse wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale(prev => Math.max(0.1, Math.min(5, prev * delta)));
  }, []);

  // Double click to zoom
  const handleDoubleClick = useCallback(() => {
    if (scale === 1) {
      setScale(2);
    } else {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [scale]);

  // Reset transformations
  const resetTransform = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setRotation(0);
  }, []);

  // Navigation functions
  const goToPrevious = useCallback(() => {
    if (images.length > 1) {
      onIndexChange((currentIndex - 1 + images.length) % images.length);
    }
  }, [currentIndex, images.length, onIndexChange]);

  const goToNext = useCallback(() => {
    if (images.length > 1) {
      onIndexChange((currentIndex + 1) % images.length);
    }
  }, [currentIndex, images.length, onIndexChange]);

  // Handle image load
  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleImageError = useCallback(() => {
    setIsLoading(false);
  }, []);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm"
          onClick={onClose}
        >
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-2 sm:p-4 bg-gradient-to-b from-black/50 to-transparent">
            <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
              <h2 className="text-white text-sm sm:text-lg font-semibold truncate">
                {title || `Image ${currentIndex + 1} of ${images.length}`}
              </h2>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={resetTransform}
                className="text-white hover:bg-white/20 bg-black/30 backdrop-blur-sm"
                title="Reset zoom and rotation"
              >
                <RotateCw className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/20 bg-black/30 backdrop-blur-sm"
                title="Close lightbox"
              >
                <X className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>

          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="lg"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20 bg-black/30 backdrop-blur-sm"
                title="Previous image"
              >
                <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20 bg-black/30 backdrop-blur-sm"
                title="Next image"
              >
                <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
              </Button>
            </>
          )}

          {/* Image container */}
          <div
            ref={containerRef}
            className="absolute inset-0 flex items-center justify-center p-4 pt-20 pb-20 sm:p-8 md:p-16"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onWheel={handleWheel}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-full max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              )}
              
              <img
                ref={imageRef}
                src={currentImage}
                alt={`Image ${currentIndex + 1}`}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                style={{
                  transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px) rotate(${rotation}deg)`,
                  transformOrigin: 'center',
                  transition: touchState.isDragging || touchState.isZooming ? 'none' : 'transform 0.2s ease-out',
                  maxHeight: 'calc(100vh - 120px)', // Ensure image doesn't exceed viewport
                  maxWidth: 'calc(100vw - 80px)', // Ensure image doesn't exceed viewport
                }}
                onLoad={handleImageLoad}
                onError={handleImageError}
                onDoubleClick={handleDoubleClick}
                draggable={false}
              />
            </motion.div>
          </div>

          {/* Zoom Controls - Bottom Left (Mobile Responsive) */}
          <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 z-10 flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setScale(prev => Math.max(prev / 1.2, 0.1));
              }}
              className="text-white hover:bg-white/20 bg-black/30 backdrop-blur-sm"
              title="Zoom out"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            
            <span className="text-white text-sm min-w-[50px] text-center bg-black/30 backdrop-blur-sm px-2 py-1 rounded text-xs sm:text-sm">
              {Math.round(scale * 100)}%
            </span>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setScale(prev => Math.min(prev * 1.2, 5));
              }}
              className="text-white hover:bg-white/20 bg-black/30 backdrop-blur-sm"
              title="Zoom in"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          {/* Thumbnail strip - Bottom Center (Mobile Responsive) */}
          {images.length > 1 && (
            <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 z-10 max-w-[calc(100vw-2rem)]">
              <div className="flex space-x-1 sm:space-x-2 bg-black/50 backdrop-blur-sm rounded-lg p-1 sm:p-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      onIndexChange(index);
                    }}
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded overflow-hidden border-2 transition-all flex-shrink-0 ${
                      index === currentIndex
                        ? 'border-white'
                        : 'border-transparent hover:border-white/50'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
