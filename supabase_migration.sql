-- Migration: Add Dynamic Pricing fields to consultations table
-- Description: Adds service, package, and package_price columns to track specific pricing selections securely.

ALTER TABLE consultations 
ADD COLUMN service VARCHAR(150) DEFAULT NULL,
ADD COLUMN package VARCHAR(150) DEFAULT NULL,
ADD COLUMN package_price VARCHAR(100) DEFAULT NULL;
