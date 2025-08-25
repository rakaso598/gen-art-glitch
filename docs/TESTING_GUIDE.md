# Testing Guide - Cosmic Glitch Art Generator

## How to Test the Application

### 1. Launch the App
The development server is running at: `http://localhost:3001`

### 2. Basic Functionality Testing
- **Keyword Input**: Enter any word/phrase in the input field
- **Generate Art**: Click "Generate Art" to create unique cosmic visuals
- **Loading State**: Observe the loading animation while generation occurs
- **Multiple Keywords**: Try different keywords to see variety in patterns

### 3. Visual Features to Test

#### Main Generative Art (TrajectoryLines)
Test different keywords that should trigger different cosmic patterns:
- `void` - Black hole spirals
- `fractal` - Recursive horror patterns  
- `quantum` - Uncertainty fields
- `cosmic` - Deep space knots
- `eldritch` - Tentacle-like forms
- `nightmare` - Chaotic vortexes
- `singularity` - Gravitational wells
- `darkness` - Shadow cascades
- `infinity` - Möbius strips
- `horror` - Geometric terror
- `abyss` - Void formations
- `chaos` - Random pattern fallback

#### Background Particles
The background should show complementary cosmic patterns that change based on the main art.

### 4. Camera Controls Testing
- **Mouse**: Click and drag to rotate the view
- **Zoom**: Mouse wheel to zoom in/out
- **Pan**: Right-click and drag to pan (if supported)
- **Touch (Mobile)**: 
  - Single finger drag to rotate
  - Pinch to zoom
  - Two-finger drag to pan

### 5. Responsive Design Testing
- **Desktop**: Full UI with larger canvas
- **Mobile**: Adapted UI with smaller canvas but full functionality
- **Tablet**: Medium-sized layout

### 6. Performance Testing
- Test on different devices to ensure smooth 60fps animation
- Monitor for any lag or performance issues
- Background particles should adapt based on device performance

## Expected Visual Style
- **Dark, cosmic color palette**: Deep purples, blacks, dark blues, void colors
- **Geometric horror**: Unsettling, overwhelming patterns
- **Dynamic animation**: Constantly evolving, never static
- **Subtle effects**: Dark bloom and noise for atmosphere
- **High contrast**: Points of light against dark void

## What to Look For
✅ **Good Signs:**
- Smooth animations at 60fps
- Responsive camera controls
- Dark, cosmic visual atmosphere
- Unique patterns for different keywords
- No visual glitches or errors

❌ **Issues to Report:**
- Performance lag or stuttering
- Camera controls not working
- Bright/neon colors (should be dark/cosmic)
- Repetitive patterns regardless of keyword
- UI not responsive on mobile
- Any console errors

## Feedback Areas
1. **Visual Impact**: Does it feel cosmic/overwhelming/unsettling?
2. **Performance**: Smooth on your device?
3. **Controls**: Camera controls intuitive and responsive?
4. **Variety**: Do different keywords produce noticeably different art?
5. **Mobile Experience**: Works well on touch devices?
