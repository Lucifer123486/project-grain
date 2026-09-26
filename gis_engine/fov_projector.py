import math
from typing import Tuple

from shapely.geometry import Point, Polygon
from pyproj import CRS, Transformer

def _get_utm_crs(lat: float, lon: float) -> CRS:
    """
    Determine the UTM CRS for a given latitude and longitude.
    This ensures accurate distance calculations in meters.
    """
    utm_zone = math.floor((lon + 180) / 6) + 1
    is_northern = lat >= 0
    epsg_code = 32600 + utm_zone if is_northern else 32700 + utm_zone
    return CRS.from_epsg(epsg_code)

def generate_fov_wedge(
    lat: float, 
    lon: float, 
    azimuth_deg: float, 
    fov_deg: float = 65.0, 
    distance_m: float = 100.0
) -> Polygon:
    """
    Generates a 2D directional Field-of-View (FOV) wedge polygon.
    
    Args:
        lat (float): Latitude in decimal degrees (WGS84).
        lon (float): Longitude in decimal degrees (WGS84).
        azimuth_deg (float): Compass bearing of the camera (0-360 degrees).
        fov_deg (float, optional): Horizontal field of view angle. Defaults to 65.0.
        distance_m (float, optional): Viewing distance in meters. Defaults to 100.0.
        
    Returns:
        Polygon: A Shapely Polygon representing the FOV wedge in WGS84 (EPSG:4326).
    """
    # Define WGS84 CRS
    crs_wgs84 = CRS.from_epsg(4326)
    
    # Define local UTM CRS based on coordinate
    crs_utm = _get_utm_crs(lat, lon)
    
    # Transformers
    # Note: pyproj Transformer expects (lat, lon) for EPSG:4326 if always_xy is not set. 
    # Setting always_xy=True forces (x, y) = (lon, lat) ordering.
    transformer_to_utm = Transformer.from_crs(crs_wgs84, crs_utm, always_xy=True)
    transformer_to_wgs84 = Transformer.from_crs(crs_utm, crs_wgs84, always_xy=True)
    
    # Convert camera origin to UTM
    origin_x, origin_y = transformer_to_utm.transform(lon, lat)
    
    # Calculate angles for the wedge
    # Azimuth is clockwise from North (0). 
    # Math angles are counter-clockwise from East (0).
    # Math angle = 90 - Azimuth
    center_angle_math = 90 - azimuth_deg
    
    half_fov = fov_deg / 2.0
    start_angle = math.radians(center_angle_math + half_fov) # Left boundary
    end_angle = math.radians(center_angle_math - half_fov)   # Right boundary
    
    # Generate points along the arc
    num_points = 20 # Resolution of the arc
    wedge_points = [(origin_x, origin_y)]
    
    # Generate arc points
    for i in range(num_points + 1):
        # Interpolate angle
        t = i / num_points
        angle = start_angle * (1 - t) + end_angle * t
        
        arc_x = origin_x + distance_m * math.cos(angle)
        arc_y = origin_y + distance_m * math.sin(angle)
        wedge_points.append((arc_x, arc_y))
        
    # Close the polygon
    wedge_points.append((origin_x, origin_y))
    
    # Transform points back to WGS84
    wgs84_points = []
    for x, y in wedge_points:
        w_lon, w_lat = transformer_to_wgs84.transform(x, y)
        wgs84_points.append((w_lon, w_lat))
        
    return Polygon(wgs84_points)
