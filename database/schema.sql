-- Project G.R.A.I.N Database Schema Migration
-- PostgreSQL 16 + PostGIS Setup

-- Enable PostGIS extension for spatial data processing
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. Micro-watershed Boundaries
CREATE TABLE IF NOT EXISTS watershed_basins (
    id SERIAL PRIMARY KEY,
    basin_code VARCHAR(100) UNIQUE NOT NULL,
    state VARCHAR(100),
    district VARCHAR(100),
    area_sqkm NUMERIC(10, 4),
    -- Stores the boundary polygon in WGS 84 (EPSG:4326)
    geom GEOMETRY(Polygon, 4326) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_watershed_basins_geom ON watershed_basins USING GIST (geom);

-- 2. Multi-temporal Satellite Rasters Metadata (SRISHTI Pipeline)
CREATE TABLE IF NOT EXISTS satellite_rasters (
    id SERIAL PRIMARY KEY,
    satellite_name VARCHAR(50) NOT NULL, -- e.g., 'Sentinel-2', 'Landsat-8', 'Bhuvan'
    capture_date DATE NOT NULL,
    resolution_m NUMERIC(5, 2) NOT NULL, -- e.g., 30.0 for 30m resolution
    s3_path VARCHAR(255) NOT NULL,
    -- Bounding box of the raster extent
    bbox_geom GEOMETRY(Polygon, 4326) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_satellite_rasters_bbox ON satellite_rasters USING GIST (bbox_geom);

-- 3. Ground Geo-tagged Photographs (DRISHTI Bridge)
CREATE TABLE IF NOT EXISTS drishti_photos (
    id SERIAL PRIMARY KEY,
    watershed_id INTEGER REFERENCES watershed_basins(id) ON DELETE SET NULL,
    image_url VARCHAR(255) NOT NULL,
    
    -- EXIF Data
    capture_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    azimuth_deg NUMERIC(6, 2) NOT NULL, -- Compass bearing
    
    -- AI Classification Output
    asset_class VARCHAR(50), -- e.g., 'Check Dam', 'Farm Pond', 'Contour Trench'
    asset_status VARCHAR(50), -- e.g., 'Intact', 'Silted', 'Damaged'
    ai_confidence_score NUMERIC(4, 3), -- 0.000 to 1.000
    
    -- Spatial Geometries
    -- The exact point where the photo was taken
    point_geom GEOMETRY(Point, 4326) NOT NULL,
    -- The calculated 2D Directional FOV Wedge
    fov_polygon_geom GEOMETRY(Polygon, 4326) NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_drishti_photos_point ON drishti_photos USING GIST (point_geom);
CREATE INDEX IF NOT EXISTS idx_drishti_photos_fov ON drishti_photos USING GIST (fov_polygon_geom);

-- 4. Ridge-to-Valley Terrain Siting Engine Recommendations
CREATE TABLE IF NOT EXISTS siting_recommendations (
    id SERIAL PRIMARY KEY,
    watershed_id INTEGER REFERENCES watershed_basins(id) ON DELETE CASCADE,
    recommended_asset_type VARCHAR(50) NOT NULL, -- e.g., 'Check Dam'
    
    -- Hydrological parameters
    stream_order INTEGER, -- e.g., 1, 2, or 3
    flow_accumulation NUMERIC(15, 2),
    slope_percent NUMERIC(5, 2),
    
    -- Candidate Location
    point_geom GEOMETRY(Point, 4326) NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_siting_recommendations_point ON siting_recommendations USING GIST (point_geom);
