from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from geoalchemy2 import Geometry

from .database import Base

class WatershedBasin(Base):
    __tablename__ = "watershed_basins"
    
    id = Column(Integer, primary_key=True, index=True)
    basin_code = Column(String(100), unique=True, nullable=False)
    state = Column(String(100))
    district = Column(String(100))
    area_sqkm = Column(Numeric(10, 4))
    geom = Column(Geometry('POLYGON', srid=4326), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class DrishtiPhoto(Base):
    __tablename__ = "drishti_photos"
    
    id = Column(Integer, primary_key=True, index=True)
    watershed_id = Column(Integer, ForeignKey("watershed_basins.id", ondelete="SET NULL"), nullable=True)
    image_url = Column(String(255), nullable=False)
    
    capture_timestamp = Column(DateTime(timezone=True), nullable=False)
    azimuth_deg = Column(Numeric(6, 2), nullable=False)
    
    asset_class = Column(String(50))
    asset_status = Column(String(50))
    ai_confidence_score = Column(Numeric(4, 3))
    
    point_geom = Column(Geometry('POINT', srid=4326), nullable=False)
    fov_polygon_geom = Column(Geometry('POLYGON', srid=4326), nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
