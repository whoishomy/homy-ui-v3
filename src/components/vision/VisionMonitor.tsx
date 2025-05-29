import React, { useEffect, useRef, useState } from 'react';
import { VisionEngine } from '../../vision/VisionEngine';
import { VisionContext, VisionConfig, VisionResult, DetectedObject } from '../../vision/types';
import { Box, Button, Card, Grid, Typography, CircularProgress } from '@mui/material';
import { ProcessingCapabilities } from '../../vision/ProcessingCapabilities';

interface VisionMonitorProps {
  initialConfig: VisionConfig;
  onResult?: (result: VisionResult) => void;
  onError?: (error: Error) => void;
}

export const VisionMonitor: React.FC<VisionMonitorProps> = ({
  initialConfig,
  onResult,
  onError,
}) => {
  const [context, setContext] = useState<VisionContext | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<VisionEngine | null>(null);

  useEffect(() => {
    const initializeEngine = async () => {
      try {
        engineRef.current = VisionEngine.getInstance(initialConfig);
        engineRef.current.on('error', (error: Error) => onError?.(error));
        await engineRef.current.start();
        setContext(engineRef.current.getContext());
      } catch (error) {
        onError?.(error instanceof Error ? error : new Error('Failed to initialize vision engine'));
      }
    };

    initializeEngine();

    return () => {
      engineRef.current?.stop();
    };
  }, [initialConfig, onError]);

  const startProcessing = async () => {
    if (!videoRef.current || !canvasRef.current || !engineRef.current) return;

    setIsProcessing(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      await videoRef.current.play();

      const processFrame = async () => {
        if (!videoRef.current || !canvasRef.current || !engineRef.current) return;

        const context = canvasRef.current.getContext('2d');
        if (!context) return;

        context.drawImage(
          videoRef.current,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        const imageData = context.getImageData(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );

        try {
          const result = await engineRef.current.process<DetectedObject[]>(imageData);
          onResult?.(result);
          drawDetections(context, result.data);
          setContext(engineRef.current.getContext());
        } catch (error) {
          onError?.(error instanceof Error ? error : new Error('Processing failed'));
        }

        if (isProcessing) {
          requestAnimationFrame(processFrame);
        }
      };

      processFrame();
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error('Failed to access camera'));
      setIsProcessing(false);
    }
  };

  const stopProcessing = () => {
    setIsProcessing(false);
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach((track) => track.stop());
  };

  const drawDetections = (context: CanvasRenderingContext2D, detections: DetectedObject[]) => {
    detections.forEach((detection) => {
      const { x, y, width, height } = detection.boundingBox;

      context.strokeStyle = '#00ff00';
      context.lineWidth = 2;
      context.strokeRect(x, y, width, height);

      context.fillStyle = '#00ff00';
      context.font = '16px Arial';
      context.fillText(`${detection.label} (${Math.round(detection.confidence * 100)}%)`, x, y - 5);
    });
  };

  return (
    <Card sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Typography variant="h6">HomyOS Vision Monitor</Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Box position="relative" width="100%" height="400px">
            <video ref={videoRef} style={{ display: 'none' }} width="100%" height="100%" />
            <canvas
              ref={canvasRef}
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#000',
              }}
              width={640}
              height={480}
            />
            {!isProcessing && !context && (
              <Box
                position="absolute"
                top="50%"
                left="50%"
                sx={{ transform: 'translate(-50%, -50%)' }}
              >
                <Button variant="contained" onClick={startProcessing}>
                  Start Vision Processing
                </Button>
              </Box>
            )}
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Box>
            <Typography variant="subtitle1">Status</Typography>
            <Typography>Status: {context?.status || 'Initializing...'}</Typography>
            <Typography>Processing: {isProcessing ? 'Active' : 'Inactive'}</Typography>
            <Typography>Objects Detected: {context?.stats.framesProcessed || 0}</Typography>
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
};
