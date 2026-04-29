/*
 Navicat Premium Data Transfer

 Source Server         : jsm
 Source Server Type    : PostgreSQL
 Source Server Version : 180003 (180003)
 Source Host           : localhost:5432
 Source Catalog        : postgres
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 180003 (180003)
 File Encoding         : 65001

 Date: 28/04/2026 15:12:33
*/


-- ----------------------------
-- Sequence structure for activos_fijos_act_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."activos_fijos_act_id_seq";
CREATE SEQUENCE "public"."activos_fijos_act_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for alerta_sistema_ale_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."alerta_sistema_ale_id_seq";
CREATE SEQUENCE "public"."alerta_sistema_ale_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for cat_tipo_activo_tip_act_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."cat_tipo_activo_tip_act_id_seq";
CREATE SEQUENCE "public"."cat_tipo_activo_tip_act_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for cat_tipo_instalacion_tip_inst_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."cat_tipo_instalacion_tip_inst_id_seq";
CREATE SEQUENCE "public"."cat_tipo_instalacion_tip_inst_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for cat_zona_pesca_zon_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."cat_zona_pesca_zon_id_seq";
CREATE SEQUENCE "public"."cat_zona_pesca_zon_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for categoria_especie_cat_esp_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."categoria_especie_cat_esp_id_seq";
CREATE SEQUENCE "public"."categoria_especie_cat_esp_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for clientes_cli_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."clientes_cli_id_seq";
CREATE SEQUENCE "public"."clientes_cli_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for contrato_historial_con_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."contrato_historial_con_id_seq";
CREATE SEQUENCE "public"."contrato_historial_con_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for cooperativas_coop_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."cooperativas_coop_id_seq";
CREATE SEQUENCE "public"."cooperativas_coop_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for embarcacion_emb_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."embarcacion_emb_id_seq";
CREATE SEQUENCE "public"."embarcacion_emb_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for especie_esp_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."especie_esp_id_seq";
CREATE SEQUENCE "public"."especie_esp_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for instalacion_inst_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."instalacion_inst_id_seq";
CREATE SEQUENCE "public"."instalacion_inst_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for insumo_ins_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."insumo_ins_id_seq";
CREATE SEQUENCE "public"."insumo_ins_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for inventario_insumos_inv_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."inventario_insumos_inv_id_seq";
CREATE SEQUENCE "public"."inventario_insumos_inv_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for liquidacion_viaje_liq_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."liquidacion_viaje_liq_id_seq";
CREATE SEQUENCE "public"."liquidacion_viaje_liq_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for movimientos_inventario_mov_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."movimientos_inventario_mov_id_seq";
CREATE SEQUENCE "public"."movimientos_inventario_mov_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for pago_tripulacion_pag_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."pago_tripulacion_pag_id_seq";
CREATE SEQUENCE "public"."pago_tripulacion_pag_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for permiso_detalle_especie_per_det_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."permiso_detalle_especie_per_det_id_seq";
CREATE SEQUENCE "public"."permiso_detalle_especie_per_det_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for permisos_pesca_per_pes_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."permisos_pesca_per_pes_id_seq";
CREATE SEQUENCE "public"."permisos_pesca_per_pes_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for personal_per_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."personal_per_id_seq";
CREATE SEQUENCE "public"."personal_per_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for rol_rol_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."rol_rol_id_seq";
CREATE SEQUENCE "public"."rol_rol_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for venta_detalle_ven_det_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."venta_detalle_ven_det_id_seq";
CREATE SEQUENCE "public"."venta_detalle_ven_det_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for venta_ven_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."venta_ven_id_seq";
CREATE SEQUENCE "public"."venta_ven_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for viaje_detalle_captura_det_cap_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."viaje_detalle_captura_det_cap_id_seq";
CREATE SEQUENCE "public"."viaje_detalle_captura_det_cap_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for viaje_gastos_gas_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."viaje_gastos_gas_id_seq";
CREATE SEQUENCE "public"."viaje_gastos_gas_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for viaje_via_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."viaje_via_id_seq";
CREATE SEQUENCE "public"."viaje_via_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Table structure for activos_fijos
-- ----------------------------
DROP TABLE IF EXISTS "public"."activos_fijos";
CREATE TABLE "public"."activos_fijos" (
  "act_id" int4 NOT NULL DEFAULT nextval('activos_fijos_act_id_seq'::regclass),
  "act_nombre" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "act_num_serie_o_placa" varchar(50) COLLATE "pg_catalog"."default",
  "act_estado" varchar(30) COLLATE "pg_catalog"."default" DEFAULT 'Operativo'::character varying,
  "act_fk_tipo" int4 NOT NULL,
  "act_fk_cooperativa" int4 NOT NULL,
  "act_fk_instalacion" int4,
  "act_fk_embarcacion" int4
)
;

-- ----------------------------
-- Records of activos_fijos
-- ----------------------------
INSERT INTO "public"."activos_fijos" VALUES (1, 'Motor Yamaha 115HP 4 Tiempos', 'YAM-115-XYZ889', 'Operativo', 1, 1, NULL, 1);
INSERT INTO "public"."activos_fijos" VALUES (2, 'Motor Suzuki 60HP 4 Tiempos', 'SUZ-060-ABC123', 'En Reparación', 1, 1, NULL, 2);
INSERT INTO "public"."activos_fijos" VALUES (3, 'GPS Garmin Striker 4', 'GAR-STK4-9988', 'Operativo', 2, 1, NULL, 1);
INSERT INTO "public"."activos_fijos" VALUES (4, 'Cámara Frigorífica 5 Toneladas', 'FRI-5T-001', 'Operativo', 3, 1, 2, NULL);
INSERT INTO "public"."activos_fijos" VALUES (5, 'Motor Mercury 40HP', 'MER-40-QWE112', 'Operativo', 1, 2, NULL, 4);
INSERT INTO "public"."activos_fijos" VALUES (6, 'Motor Mercury 40HP', 'MER-40-QWE113', 'Operativo', 1, 2, NULL, 5);
INSERT INTO "public"."activos_fijos" VALUES (7, 'Red de Enmalle Ostionera', 'RED-OST-001', 'Operativo', 4, 2, NULL, 4);
INSERT INTO "public"."activos_fijos" VALUES (8, 'Motor Yamaha 15HP Fuera de Borda', 'YAM-15-RTY991', 'Operativo', 1, 3, NULL, 6);
INSERT INTO "public"."activos_fijos" VALUES (9, 'Aireador de Paletas (Estanque)', 'AIR-EST-22', 'Mantenimiento', 3, 3, NULL, NULL);

-- ----------------------------
-- Table structure for alerta_sistema
-- ----------------------------
DROP TABLE IF EXISTS "public"."alerta_sistema";
CREATE TABLE "public"."alerta_sistema" (
  "ale_id" int4 NOT NULL DEFAULT nextval('alerta_sistema_ale_id_seq'::regclass),
  "ale_fk_embarcacion" int4 NOT NULL,
  "ale_tipo" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "ale_mensaje" text COLLATE "pg_catalog"."default" NOT NULL,
  "ale_nivel_riesgo" varchar(20) COLLATE "pg_catalog"."default",
  "ale_fecha_generacion" timestamp(6) DEFAULT CURRENT_TIMESTAMP,
  "ale_estatus" varchar(20) COLLATE "pg_catalog"."default" DEFAULT 'No leída'::character varying
)
;

-- ----------------------------
-- Records of alerta_sistema
-- ----------------------------
INSERT INTO "public"."alerta_sistema" VALUES (1, 2, 'Mantenimiento Preventivo', 'El motor Suzuki 60HP requiere cambio de aceite y revisión de propela antes del próximo zarpe.', 'Medio', '2026-04-27 17:17:37.706733', 'No leída');
INSERT INTO "public"."alerta_sistema" VALUES (2, 3, 'Alerta Meteorológica', 'Aviso de Norte fuerte en Sonda de Campeche para el fin de semana.', 'Crítico', '2026-04-27 17:17:37.706733', 'No leída');
INSERT INTO "public"."alerta_sistema" VALUES (3, 4, 'Vencimiento de Permiso', 'El permiso de moluscos requiere renovación en 60 días.', 'Bajo', '2026-04-27 17:30:31.416112', 'No leída');
INSERT INTO "public"."alerta_sistema" VALUES (4, 6, 'Seguridad', 'Reporte de troncos flotantes en el canal del Grijalva.', 'Medio', '2026-04-27 17:30:31.416112', 'No leída');

-- ----------------------------
-- Table structure for bitacora_mantenimiento
-- ----------------------------
DROP TABLE IF EXISTS "public"."bitacora_mantenimiento";
CREATE TABLE "public"."bitacora_mantenimiento" (
  "mant_id" int4 NOT NULL DEFAULT nextval('activos_fijos_act_id_seq'::regclass),
  "mant_fk_embarcacion" int4 NOT NULL,
  "mant_fk_activo" int4,
  "mant_fecha" date NOT NULL DEFAULT CURRENT_DATE,
  "mant_tipo" varchar(30) COLLATE "pg_catalog"."default",
  "mant_descripcion" text COLLATE "pg_catalog"."default",
  "mant_costo_total" numeric(12,2) DEFAULT 0,
  "mant_taller_proveedor" varchar(150) COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Records of bitacora_mantenimiento
-- ----------------------------
INSERT INTO "public"."bitacora_mantenimiento" VALUES (10, 1, NULL, '2026-04-05', 'Preventivo', 'Cambio de aceite y filtros motor Yamaha 115HP', 4500.00, 'Servicios Marinos Frontera');
INSERT INTO "public"."bitacora_mantenimiento" VALUES (11, 2, NULL, '2026-04-10', 'Correctivo', 'Reparación de propela golpeada', 3200.00, 'Taller El Pescador');
INSERT INTO "public"."bitacora_mantenimiento" VALUES (12, 4, NULL, '2026-04-12', 'Preventivo', 'Limpieza de casco (panga)', 800.00, 'Mantenimiento Local');

-- ----------------------------
-- Table structure for cat_tipo_activo
-- ----------------------------
DROP TABLE IF EXISTS "public"."cat_tipo_activo";
CREATE TABLE "public"."cat_tipo_activo" (
  "tip_act_id" int4 NOT NULL DEFAULT nextval('cat_tipo_activo_tip_act_id_seq'::regclass),
  "tip_act_nombre" varchar(50) COLLATE "pg_catalog"."default" NOT NULL
)
;

-- ----------------------------
-- Records of cat_tipo_activo
-- ----------------------------
INSERT INTO "public"."cat_tipo_activo" VALUES (1, 'Motor Fuera de Borda');
INSERT INTO "public"."cat_tipo_activo" VALUES (2, 'Equipo de Navegación (GPS/Radio)');
INSERT INTO "public"."cat_tipo_activo" VALUES (3, 'Equipo de Refrigeración');
INSERT INTO "public"."cat_tipo_activo" VALUES (4, 'Arte de Pesca Mayor');
INSERT INTO "public"."cat_tipo_activo" VALUES (5, 'Vehículo de Transporte Terrestre');

-- ----------------------------
-- Table structure for cat_tipo_instalacion
-- ----------------------------
DROP TABLE IF EXISTS "public"."cat_tipo_instalacion";
CREATE TABLE "public"."cat_tipo_instalacion" (
  "tip_inst_id" int4 NOT NULL DEFAULT nextval('cat_tipo_instalacion_tip_inst_id_seq'::regclass),
  "tip_inst_nombre" varchar(50) COLLATE "pg_catalog"."default" NOT NULL
)
;

-- ----------------------------
-- Records of cat_tipo_instalacion
-- ----------------------------
INSERT INTO "public"."cat_tipo_instalacion" VALUES (1, 'Muelle Comercial');
INSERT INTO "public"."cat_tipo_instalacion" VALUES (2, 'Centro de Acopio y Procesamiento');
INSERT INTO "public"."cat_tipo_instalacion" VALUES (3, 'Oficina Administrativa');
INSERT INTO "public"."cat_tipo_instalacion" VALUES (4, 'Bodega de Insumos');

-- ----------------------------
-- Table structure for categoria_especie
-- ----------------------------
DROP TABLE IF EXISTS "public"."categoria_especie";
CREATE TABLE "public"."categoria_especie" (
  "cat_esp_id" int4 NOT NULL DEFAULT nextval('categoria_especie_cat_esp_id_seq'::regclass),
  "cat_esp_nombre" varchar(50) COLLATE "pg_catalog"."default" NOT NULL
)
;

-- ----------------------------
-- Records of categoria_especie
-- ----------------------------
INSERT INTO "public"."categoria_especie" VALUES (1, 'Pargo / Huachinango');
INSERT INTO "public"."categoria_especie" VALUES (2, 'Camarón');
INSERT INTO "public"."categoria_especie" VALUES (3, 'Pulpo');
INSERT INTO "public"."categoria_especie" VALUES (4, 'Mojarra');
INSERT INTO "public"."categoria_especie" VALUES (5, 'Robalo');
INSERT INTO "public"."categoria_especie" VALUES (6, 'Jaiba');
INSERT INTO "public"."categoria_especie" VALUES (7, 'Tiburón / Cazón');
INSERT INTO "public"."categoria_especie" VALUES (8, 'Especies de Río / Otros');

-- ----------------------------
-- Table structure for clientes
-- ----------------------------
DROP TABLE IF EXISTS "public"."clientes";
CREATE TABLE "public"."clientes" (
  "cli_id" int4 NOT NULL DEFAULT nextval('clientes_cli_id_seq'::regclass),
  "cli_nombre" varchar(150) COLLATE "pg_catalog"."default" NOT NULL,
  "cli_rfc" varchar(13) COLLATE "pg_catalog"."default",
  "cli_tipo" varchar(20) COLLATE "pg_catalog"."default",
  "cli_telefono" varchar(20) COLLATE "pg_catalog"."default",
  "cli_direccion" text COLLATE "pg_catalog"."default",
  "cli_fk_cooperativa" int4 NOT NULL
)
;

-- ----------------------------
-- Records of clientes
-- ----------------------------
INSERT INTO "public"."clientes" VALUES (1, 'Distribuidora de Mariscos La Viga SA de CV', 'DMV950812AAA', 'Mayoreo', '5551234567', 'Mercado La Viga, CDMX', 1);
INSERT INTO "public"."clientes" VALUES (2, 'Restaurante El Costeño', 'REC120305BBB', 'Menudeo', '9933158900', 'Malecón, Villahermosa, Tab.', 1);
INSERT INTO "public"."clientes" VALUES (3, 'Congeladora del Sureste', 'CSU180922CCC', 'Mayoreo', '9811223344', 'Puerto Industrial, Ciudad del Carmen, Camp.', 1);
INSERT INTO "public"."clientes" VALUES (4, 'Pescadería El Puerto', 'PEPU880101XYZ', 'Menudeo', '9931234455', 'Mercado Pino Suárez, Villahermosa, Tab.', 1);
INSERT INTO "public"."clientes" VALUES (5, 'Mariscos Don Chepe', 'MDCH990202ABC', 'Menudeo', '9331112233', 'Mercado Municipal, Comalcalco, Tab.', 1);
INSERT INTO "public"."clientes" VALUES (6, 'Exportadora del Golfo', 'EXGO770303QWE', 'Mayoreo', '9812223344', 'Puerto de Seybaplaya, Campeche', 1);
INSERT INTO "public"."clientes" VALUES (7, 'Restaurante Las Gaviotas', 'RGAV660404RTY', 'Menudeo', '9934445566', 'Corredor Gastronómico, Paraíso, Tab.', 1);

-- ----------------------------
-- Table structure for contrato_historial
-- ----------------------------
DROP TABLE IF EXISTS "public"."contrato_historial";
CREATE TABLE "public"."contrato_historial" (
  "con_id" int4 NOT NULL DEFAULT nextval('contrato_historial_con_id_seq'::regclass),
  "con_fk_personal" int4 NOT NULL,
  "con_fecha_inicio" date NOT NULL,
  "con_fecha_fin" date,
  "con_salario_base" numeric(10,2),
  "con_estatus" varchar(20) COLLATE "pg_catalog"."default" DEFAULT 'Activo'::character varying,
  "con_motivo_cambio" text COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Records of contrato_historial
-- ----------------------------
INSERT INTO "public"."contrato_historial" VALUES (1, 4, '2025-01-15', NULL, 12000.00, 'Activo', 'Contratación Inicial Administradora');
INSERT INTO "public"."contrato_historial" VALUES (2, 1, '2024-05-01', NULL, NULL, 'Activo', 'Contrato a destajo/puntos como Capitán Socio');
INSERT INTO "public"."contrato_historial" VALUES (3, 6, '2026-01-01', NULL, 8500.00, 'Activo', 'Ingreso Cooperativa 2');
INSERT INTO "public"."contrato_historial" VALUES (4, 9, '2026-02-01', NULL, 9000.00, 'Activo', 'Ingreso Cooperativa 3');

-- ----------------------------
-- Table structure for cooperativa
-- ----------------------------
DROP TABLE IF EXISTS "public"."cooperativa";
CREATE TABLE "public"."cooperativa" (
  "coop_id" int4 NOT NULL DEFAULT nextval('cooperativas_coop_id_seq'::regclass),
  "coop_nombre" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "coop_razon_social" varchar(150) COLLATE "pg_catalog"."default",
  "coop_rfc" varchar(13) COLLATE "pg_catalog"."default",
  "coop_representante_legal" varchar(100) COLLATE "pg_catalog"."default",
  "coop_porcentaje_retencion" numeric(5,2) DEFAULT 0.00,
  "coop_telefono" varchar(20) COLLATE "pg_catalog"."default",
  "coop_email" varchar(100) COLLATE "pg_catalog"."default",
  "coop_estatus" bool DEFAULT true,
  "coop_fk_instalacion" int4
)
;

-- ----------------------------
-- Records of cooperativa
-- ----------------------------
INSERT INTO "public"."cooperativa" VALUES (1, 'Pescadores del Golfo', 'Sociedad Cooperativa Pescadores del Golfo S.C. de R.L.', 'PCG901015XYZ', 'Arturo Domínguez Pérez', 10.00, '9931234567', 'contacto@pescadoresgolfo.mx', 't', 3);
INSERT INTO "public"."cooperativa" VALUES (2, 'Ostioneros de la Chontalpa', 'S.C.P.P. Ostioneros de la Chontalpa S.C.L.', 'OCH220510ABC', 'Javier Magaña Ruiz', 8.00, '9339876543', 'ventas@ostioneroschontalpa.com', 't', 5);
INSERT INTO "public"."cooperativa" VALUES (3, 'Riqueza del Grijalva', 'S.C.P.P. Riqueza del Grijalva S.C. de R.L.', 'RGR240115H33', 'Elena Jiménez Osorio', 12.00, '9133345566', 'gerencia@riquezagrijalva.com', 't', 7);

-- ----------------------------
-- Table structure for embarcacion
-- ----------------------------
DROP TABLE IF EXISTS "public"."embarcacion";
CREATE TABLE "public"."embarcacion" (
  "emb_id" int4 NOT NULL DEFAULT nextval('embarcacion_emb_id_seq'::regclass),
  "emb_matricula" varchar(30) COLLATE "pg_catalog"."default" NOT NULL,
  "emb_nombre" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "emb_categoria" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "emb_capacidad_kg" numeric(8,2) NOT NULL,
  "emb_estatus" varchar(30) COLLATE "pg_catalog"."default" NOT NULL DEFAULT 'Operativo'::character varying,
  "emb_fk_cooperativa" int4 NOT NULL,
  "emb_fk_instalacion_base" int4 NOT NULL,
  "emb_capacidad_personal" int4 NOT NULL
)
;

-- ----------------------------
-- Records of embarcacion
-- ----------------------------
INSERT INTO "public"."embarcacion" VALUES (1, 'TAB-2701-P', 'La Gaviota I', 'Lancha Ribereña', 1500.00, 'Operativo', 1, 1, 6);
INSERT INTO "public"."embarcacion" VALUES (2, 'TAB-2702-P', 'El Tritón', 'Lancha Ribereña', 2000.00, 'En Mantenimiento', 1, 1, 8);
INSERT INTO "public"."embarcacion" VALUES (3, 'CAM-1504-P', 'Mar de Plata', 'Barco Mediano', 8000.00, 'Operativo', 1, 2, 10);
INSERT INTO "public"."embarcacion" VALUES (4, 'TAB-3501-P', 'El Ostión de Oro', 'Panga Ribereña', 800.00, 'Operativo', 2, 4, 8);
INSERT INTO "public"."embarcacion" VALUES (5, 'TAB-3502-P', 'Rayo del Sur', 'Panga Ribereña', 800.00, 'Operativo', 2, 4, 8);
INSERT INTO "public"."embarcacion" VALUES (6, 'TAB-4205-P', 'El Guardián del Río', 'Lancha de Pasillo', 600.00, 'Operativo', 3, 6, 6);
INSERT INTO "public"."embarcacion" VALUES (7, 'TAB-4206-P', 'Centla III', 'Lancha de Pasillo', 600.00, 'Operativo', 3, 6, 8);

-- ----------------------------
-- Table structure for especie
-- ----------------------------
DROP TABLE IF EXISTS "public"."especie";
CREATE TABLE "public"."especie" (
  "esp_id" int4 NOT NULL DEFAULT nextval('especie_esp_id_seq'::regclass),
  "esp_nombre_comun" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "esp_nombre_cientifico" varchar(150) COLLATE "pg_catalog"."default",
  "esp_precio_kilo_referencia" numeric(8,2) DEFAULT 0.00,
  "esp_en_veda" bool DEFAULT false,
  "esp_estatus" bool DEFAULT true,
  "esp_fk_categoria" int4 NOT NULL
)
;

-- ----------------------------
-- Records of especie
-- ----------------------------
INSERT INTO "public"."especie" VALUES (6, 'Mero Rojo', 'Epinephelus morio', 280.00, 'f', 't', 1);
INSERT INTO "public"."especie" VALUES (9, 'Corvina Pinta', 'Cynoscion nebulosus', 140.00, 'f', 't', 1);
INSERT INTO "public"."especie" VALUES (13, 'Cojinuda', 'Caranx crysos', 50.00, 'f', 't', 1);
INSERT INTO "public"."especie" VALUES (14, 'Bagre Bandera / Mingo', 'Bagre marinus', 55.00, 'f', 't', 1);
INSERT INTO "public"."especie" VALUES (19, 'Sargo', 'Archosargus probatocephalus', 110.00, 'f', 't', 1);
INSERT INTO "public"."especie" VALUES (25, 'Langosta del Caribe', 'Panulirus argus', 650.00, 't', 't', 2);
INSERT INTO "public"."especie" VALUES (28, 'Calamar', 'Doryteuthis pealeii', 95.00, 'f', 't', 3);
INSERT INTO "public"."especie" VALUES (29, 'Caracol Rosado/Blanco', 'Lobatus gigas', 380.00, 't', 't', 3);
INSERT INTO "public"."especie" VALUES (30, 'Almeja de Laguna', 'Rangia cuneata', 50.00, 'f', 't', 3);
INSERT INTO "public"."especie" VALUES (31, 'Dorado', 'Coryphaena hippurus', 140.00, 'f', 't', 4);
INSERT INTO "public"."especie" VALUES (32, 'Atún Aleta Amarilla', 'Thunnus albacares', 230.00, 'f', 't', 4);
INSERT INTO "public"."especie" VALUES (33, 'Pez Vela', 'Istiophorus platypterus', 115.00, 't', 't', 4);
INSERT INTO "public"."especie" VALUES (1, 'Huachinango del Golfo', 'Lutjanus campechanus', 180.00, 'f', 't', 1);
INSERT INTO "public"."especie" VALUES (8, 'Pargo Mulato', 'Lutjanus griseus', 160.00, 'f', 't', 1);
INSERT INTO "public"."especie" VALUES (3, 'Camarón Blanco', 'Litopenaeus setiferus', 280.00, 'f', 't', 2);
INSERT INTO "public"."especie" VALUES (20, 'Camarón Rosado', 'Farfantepenaeus duorarum', 320.00, 'f', 't', 2);
INSERT INTO "public"."especie" VALUES (21, 'Camarón Café', 'Farfantepenaeus aztecus', 260.00, 'f', 't', 2);
INSERT INTO "public"."especie" VALUES (22, 'Camarón Siete Barbas', 'Xiphopenaeus kroyeri', 180.00, 'f', 't', 2);
INSERT INTO "public"."especie" VALUES (4, 'Pulpo Maya', 'Octopus maya', 150.00, 't', 't', 3);
INSERT INTO "public"."especie" VALUES (26, 'Ostión de Placer', 'Crassostrea virginica', 70.00, 'f', 't', 3);
INSERT INTO "public"."especie" VALUES (27, 'Pulpo Patón', 'Octopus vulgaris', 145.00, 't', 't', 3);
INSERT INTO "public"."especie" VALUES (16, 'Mojarra Tenguayaca', 'Petenia splendida', 100.00, 'f', 't', 4);
INSERT INTO "public"."especie" VALUES (17, 'Mojarra Tilapia', 'Oreochromis niloticus', 55.00, 'f', 't', 4);
INSERT INTO "public"."especie" VALUES (2, 'Robalo Blanco', 'Centropomus undecimalis', 220.00, 'f', 't', 5);
INSERT INTO "public"."especie" VALUES (18, 'Chucumite / Blanco', 'Centropomus parallelus', 175.00, 'f', 't', 5);
INSERT INTO "public"."especie" VALUES (23, 'Jaiba Azul', 'Callinectes sapidus', 85.00, 'f', 't', 6);
INSERT INTO "public"."especie" VALUES (24, 'Jaiba Prieta', 'Callinectes rathbunae', 75.00, 'f', 't', 6);
INSERT INTO "public"."especie" VALUES (5, 'Cazón', 'Rhizoprionodon terraenovae', 80.00, 'f', 't', 7);
INSERT INTO "public"."especie" VALUES (34, 'Tiburón Puntas Negras', 'Carcharhinus limbatus', 80.00, 'f', 't', 7);
INSERT INTO "public"."especie" VALUES (7, 'Sierra del Golfo', 'Scomberomorus maculatus', 95.00, 'f', 't', 8);
INSERT INTO "public"."especie" VALUES (10, 'Pámpano', 'Trachinotus carolinus', 190.00, 'f', 't', 8);
INSERT INTO "public"."especie" VALUES (11, 'Jurel', 'Caranx hippos', 60.00, 'f', 't', 8);
INSERT INTO "public"."especie" VALUES (12, 'Lisa', 'Mugil cephalus', 45.00, 'f', 't', 8);
INSERT INTO "public"."especie" VALUES (15, 'Pejelagarto', 'Atractosteus tropicus', 130.00, 'f', 't', 8);

-- ----------------------------
-- Table structure for instalacion
-- ----------------------------
DROP TABLE IF EXISTS "public"."instalacion";
CREATE TABLE "public"."instalacion" (
  "inst_id" int4 NOT NULL DEFAULT nextval('instalacion_inst_id_seq'::regclass),
  "inst_nombre" varchar(70) COLLATE "pg_catalog"."default" NOT NULL,
  "inst_latitud" numeric(10,8) NOT NULL,
  "inst_longitud" numeric(11,8) NOT NULL,
  "inst_fk_tipo" int4 NOT NULL
)
;
COMMENT ON COLUMN "public"."instalacion"."inst_id" IS 'ID de la ubicación';
COMMENT ON COLUMN "public"."instalacion"."inst_nombre" IS 'Nombre de la ubicación';
COMMENT ON COLUMN "public"."instalacion"."inst_latitud" IS 'Latitud de la ubicación';
COMMENT ON COLUMN "public"."instalacion"."inst_longitud" IS 'Logitud de la ubicación';
COMMENT ON COLUMN "public"."instalacion"."inst_fk_tipo" IS 'Tipo de ubicación';

-- ----------------------------
-- Records of instalacion
-- ----------------------------
INSERT INTO "public"."instalacion" VALUES (1, 'Muelle Principal Frontera', 18.53861100, -92.64555600, 1);
INSERT INTO "public"."instalacion" VALUES (2, 'Acopio "El Pescador" (Dos Bocas)', 18.43250000, -93.16111100, 2);
INSERT INTO "public"."instalacion" VALUES (3, 'Oficinas Centro Villahermosa', 17.98944400, -92.92805600, 3);
INSERT INTO "public"."instalacion" VALUES (4, 'Muelle Laguna del Carmen', 18.28444400, -93.87111100, 1);
INSERT INTO "public"."instalacion" VALUES (5, 'Bodega Chontalpa', 18.28500000, -93.87000000, 4);
INSERT INTO "public"."instalacion" VALUES (6, 'Atracadero Río Grijalva (Centla)', 18.52000000, -92.65000000, 1);
INSERT INTO "public"."instalacion" VALUES (7, 'Centro de Acuacultura Grijalva', 18.52100000, -92.65100000, 2);

-- ----------------------------
-- Table structure for insumo
-- ----------------------------
DROP TABLE IF EXISTS "public"."insumo";
CREATE TABLE "public"."insumo" (
  "ins_id" int4 NOT NULL DEFAULT nextval('insumo_ins_id_seq'::regclass),
  "ins_nombre" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "ins_categoria" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "ins_unidad_medida" varchar(20) COLLATE "pg_catalog"."default" NOT NULL,
  "ins_costo_unitario_referencia" numeric(8,2) DEFAULT 0.00,
  "ins_estatus" bool DEFAULT true
)
;

-- ----------------------------
-- Records of insumo
-- ----------------------------
INSERT INTO "public"."insumo" VALUES (1, 'Diésel Marino Especial', 'Combustible', 'Litros', 24.50, 't');
INSERT INTO "public"."insumo" VALUES (2, 'Hielo en Escamas', 'Conservación', 'Toneladas', 850.00, 't');
INSERT INTO "public"."insumo" VALUES (3, 'Carnada (Sardina)', 'Pesca', 'Kilogramos', 35.00, 't');
INSERT INTO "public"."insumo" VALUES (4, 'Aceite para Motor 2T', 'Mantenimiento', 'Litros', 120.00, 't');
INSERT INTO "public"."insumo" VALUES (5, 'Cuerda de Nylon 3/4', 'Aparejos', 'Metros', 45.00, 't');

-- ----------------------------
-- Table structure for inventario_insumos
-- ----------------------------
DROP TABLE IF EXISTS "public"."inventario_insumos";
CREATE TABLE "public"."inventario_insumos" (
  "inv_id" int4 NOT NULL DEFAULT nextval('inventario_insumos_inv_id_seq'::regclass),
  "inv_fk_instalacion" int4 NOT NULL,
  "inv_fk_insumo" int4 NOT NULL,
  "inv_cantidad_actual" numeric(10,2) DEFAULT 0.00,
  "inv_ultima_actualizacion" timestamp(6) DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of inventario_insumos
-- ----------------------------
INSERT INTO "public"."inventario_insumos" VALUES (1, 1, 1, 1500.00, '2026-04-27 17:17:37.685556');
INSERT INTO "public"."inventario_insumos" VALUES (2, 1, 2, 10.00, '2026-04-27 17:17:37.685556');
INSERT INTO "public"."inventario_insumos" VALUES (3, 1, 3, 200.00, '2026-04-27 17:17:37.685556');
INSERT INTO "public"."inventario_insumos" VALUES (4, 4, 1, 800.00, '2026-04-27 17:30:31.356286');
INSERT INTO "public"."inventario_insumos" VALUES (5, 4, 2, 5.00, '2026-04-27 17:30:31.356286');
INSERT INTO "public"."inventario_insumos" VALUES (6, 7, 1, 400.00, '2026-04-27 17:30:31.356286');
INSERT INTO "public"."inventario_insumos" VALUES (7, 7, 4, 50.00, '2026-04-27 17:30:31.356286');

-- ----------------------------
-- Table structure for liquidacion_viaje
-- ----------------------------
DROP TABLE IF EXISTS "public"."liquidacion_viaje";
CREATE TABLE "public"."liquidacion_viaje" (
  "liq_id" int4 NOT NULL DEFAULT nextval('liquidacion_viaje_liq_id_seq'::regclass),
  "liq_fk_viaje" int4 NOT NULL,
  "liq_fecha" timestamp(6) DEFAULT CURRENT_TIMESTAMP,
  "liq_ingreso_bruto" numeric(12,2) NOT NULL,
  "liq_gastos_descontables" numeric(12,2) NOT NULL,
  "liq_ganancia_neta" numeric(12,2) NOT NULL,
  "liq_monto_cooperativa" numeric(12,2) NOT NULL,
  "liq_bolsa_tripulacion" numeric(12,2) NOT NULL
)
;

-- ----------------------------
-- Records of liquidacion_viaje
-- ----------------------------
INSERT INTO "public"."liquidacion_viaje" VALUES (1, 1, '2026-04-25 10:00:00', 42362.50, 7225.00, 35137.50, 3513.75, 31623.75);
INSERT INTO "public"."liquidacion_viaje" VALUES (2, 10, '2026-04-20 18:00:00', 25950.00, 1160.00, 24790.00, 1983.20, 22806.80);
INSERT INTO "public"."liquidacion_viaje" VALUES (5, 11, '2026-04-22 19:00:00', 25200.00, 607.50, 24592.50, 2951.10, 21641.40);
INSERT INTO "public"."liquidacion_viaje" VALUES (6, 20, '2026-04-19 09:00:00', 105000.00, 16825.00, 88175.00, 8817.50, 79357.50);
INSERT INTO "public"."liquidacion_viaje" VALUES (7, 21, '2026-04-21 10:00:00', 9000.00, 612.50, 8387.50, 671.00, 7716.50);
INSERT INTO "public"."liquidacion_viaje" VALUES (8, 22, '2026-04-23 09:00:00', 7560.00, 367.50, 7192.50, 863.10, 6329.40);

-- ----------------------------
-- Table structure for movimientos_inventario
-- ----------------------------
DROP TABLE IF EXISTS "public"."movimientos_inventario";
CREATE TABLE "public"."movimientos_inventario" (
  "mov_id" int4 NOT NULL DEFAULT nextval('movimientos_inventario_mov_id_seq'::regclass),
  "mov_fk_instalacion" int4 NOT NULL,
  "mov_fk_insumo" int4 NOT NULL,
  "mov_tipo" varchar(20) COLLATE "pg_catalog"."default" NOT NULL,
  "mov_cantidad" numeric(10,2) NOT NULL,
  "mov_fecha" timestamp(6) DEFAULT CURRENT_TIMESTAMP,
  "mov_observaciones" text COLLATE "pg_catalog"."default",
  "mov_fk_personal" int4 NOT NULL
)
;

-- ----------------------------
-- Records of movimientos_inventario
-- ----------------------------
INSERT INTO "public"."movimientos_inventario" VALUES (1, 1, 1, 'Entrada', 2000.00, '2026-04-20 08:00:00', 'Carga inicial de pipa de PEMEX', 4);
INSERT INTO "public"."movimientos_inventario" VALUES (2, 1, 1, 'Salida', 500.00, '2026-04-22 06:30:00', 'Carga para viaje de La Gaviota I', 4);
INSERT INTO "public"."movimientos_inventario" VALUES (3, 7, 1, 'Entrada', 1000.00, '2026-04-15 09:00:00', 'Compra de combustible mensual', 11);
INSERT INTO "public"."movimientos_inventario" VALUES (4, 4, 1, 'Entrada', 1000.00, '2026-04-01 09:00:00', 'Surtido inicial de diésel (Coop 2)', 8);

-- ----------------------------
-- Table structure for pago_tripulacion
-- ----------------------------
DROP TABLE IF EXISTS "public"."pago_tripulacion";
CREATE TABLE "public"."pago_tripulacion" (
  "pag_id" int4 NOT NULL DEFAULT nextval('pago_tripulacion_pag_id_seq'::regclass),
  "pag_fk_liquidacion" int4 NOT NULL,
  "pag_fk_personal" int4 NOT NULL,
  "pag_puntos_aplicados" numeric(4,2) NOT NULL,
  "pag_monto_recibido" numeric(10,2) NOT NULL
)
;

-- ----------------------------
-- Records of pago_tripulacion
-- ----------------------------
INSERT INTO "public"."pago_tripulacion" VALUES (1, 1, 1, 3.00, 13553.03);
INSERT INTO "public"."pago_tripulacion" VALUES (2, 1, 2, 2.00, 9035.35);
INSERT INTO "public"."pago_tripulacion" VALUES (3, 1, 3, 1.00, 4517.68);
INSERT INTO "public"."pago_tripulacion" VALUES (4, 1, 5, 1.00, 4517.68);
INSERT INTO "public"."pago_tripulacion" VALUES (7, 2, 6, 3.00, 17105.10);
INSERT INTO "public"."pago_tripulacion" VALUES (8, 2, 7, 1.00, 5701.70);
INSERT INTO "public"."pago_tripulacion" VALUES (9, 5, 9, 3.00, 16231.05);
INSERT INTO "public"."pago_tripulacion" VALUES (10, 5, 10, 1.00, 5410.35);

-- ----------------------------
-- Table structure for permiso_detalle_especie
-- ----------------------------
DROP TABLE IF EXISTS "public"."permiso_detalle_especie";
CREATE TABLE "public"."permiso_detalle_especie" (
  "per_det_id" int4 NOT NULL DEFAULT nextval('permiso_detalle_especie_per_det_id_seq'::regclass),
  "per_det_fk_permiso" int4 NOT NULL,
  "per_det_fk_especie" int4 NOT NULL,
  "per_det_cuota_maxima_toneladas" numeric(10,2)
)
;

-- ----------------------------
-- Records of permiso_detalle_especie
-- ----------------------------
INSERT INTO "public"."permiso_detalle_especie" VALUES (1, 1, 1, 50.00);
INSERT INTO "public"."permiso_detalle_especie" VALUES (2, 1, 2, 30.00);
INSERT INTO "public"."permiso_detalle_especie" VALUES (3, 2, 3, 100.00);
INSERT INTO "public"."permiso_detalle_especie" VALUES (4, 3, 21, 50.00);
INSERT INTO "public"."permiso_detalle_especie" VALUES (5, 3, 18, 5.00);
INSERT INTO "public"."permiso_detalle_especie" VALUES (6, 3, 19, 3.00);
INSERT INTO "public"."permiso_detalle_especie" VALUES (7, 3, 11, 8.00);
INSERT INTO "public"."permiso_detalle_especie" VALUES (8, 3, 14, 2.00);
INSERT INTO "public"."permiso_detalle_especie" VALUES (9, 4, 15, 15.00);
INSERT INTO "public"."permiso_detalle_especie" VALUES (10, 4, 17, 80.00);
INSERT INTO "public"."permiso_detalle_especie" VALUES (11, 4, 16, 12.00);
INSERT INTO "public"."permiso_detalle_especie" VALUES (12, 4, 13, 4.00);
INSERT INTO "public"."permiso_detalle_especie" VALUES (13, 4, 9, 3.50);

-- ----------------------------
-- Table structure for permisos_pesca
-- ----------------------------
DROP TABLE IF EXISTS "public"."permisos_pesca";
CREATE TABLE "public"."permisos_pesca" (
  "per_pes_id" int4 NOT NULL DEFAULT nextval('permisos_pesca_per_pes_id_seq'::regclass),
  "per_pes_folio" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "per_pes_tipo" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "per_pes_fecha_emision" date NOT NULL,
  "per_pes_fecha_vencimiento" date NOT NULL,
  "per_pes_estatus" varchar(30) COLLATE "pg_catalog"."default" DEFAULT 'Vigente'::character varying,
  "per_pes_fk_embarcacion" int4 NOT NULL,
  "per_pes_fk_cooperativa" int4 NOT NULL
)
;

-- ----------------------------
-- Records of permisos_pesca
-- ----------------------------
INSERT INTO "public"."permisos_pesca" VALUES (1, 'CONAPESCA-TAB-2026-001', 'Pesca Comercial de Escama Marina', '2026-01-01', '2027-12-31', 'Vigente', 1, 1);
INSERT INTO "public"."permisos_pesca" VALUES (2, 'CONAPESCA-TAB-2026-002', 'Pesca Comercial de Camarón', '2026-01-01', '2027-12-31', 'Vigente', 3, 1);
INSERT INTO "public"."permisos_pesca" VALUES (3, 'CONAPESCA-TAB-2026-003', 'Permiso de Recolección de Moluscos', '2026-01-10', '2028-01-10', 'Vigente', 4, 2);
INSERT INTO "public"."permisos_pesca" VALUES (4, 'CONAPESCA-TAB-2026-004', 'Pesca de Fomento y Acuacultura', '2026-02-15', '2027-02-15', 'Vigente', 6, 3);

-- ----------------------------
-- Table structure for personal
-- ----------------------------
DROP TABLE IF EXISTS "public"."personal";
CREATE TABLE "public"."personal" (
  "per_id" int4 NOT NULL DEFAULT nextval('personal_per_id_seq'::regclass),
  "per_auth_uuid" uuid,
  "per_nombre" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "per_apellidos" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "per_curp" varchar(18) COLLATE "pg_catalog"."default",
  "per_telefono" varchar(20) COLLATE "pg_catalog"."default",
  "per_contacto_emergencia" varchar(150) COLLATE "pg_catalog"."default",
  "per_estatus" bool DEFAULT true,
  "per_fk_rol" int4 NOT NULL,
  "per_fk_cooperativa" int4 NOT NULL,
  "per_nss" varchar(11) COLLATE "pg_catalog"."default",
  "per_es_socio" bool DEFAULT false,
  "per_numero_socio" varchar(20) COLLATE "pg_catalog"."default",
  "per_certificado_aportacion" varchar(50) COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Records of personal
-- ----------------------------
INSERT INTO "public"."personal" VALUES (1, 'cef5bdf9-d61e-4854-a5df-ad0b767cb8a9', 'Manuel', 'López Cruz', 'LOCM850110HCSXNL01', '9932112233', 'María Cruz (Madre) 9934445566', 't', 1, 1, '12345678901', 't', 'S-001', 'CERT-2023-01');
INSERT INTO "public"."personal" VALUES (2, 'c682ce9c-1158-477c-990e-80bffa716972', 'Roberto', 'Méndez Ruiz', 'MERR900520HCSXNL02', '9933334455', 'Ana Ruiz (Esposa) 9931112222', 't', 2, 1, '10987654321', 't', 'S-005', 'CERT-2023-05');
INSERT INTO "public"."personal" VALUES (3, '054f8788-5c31-42ec-bec8-94706a81c0ec', 'Juan', 'Gómez Silva', 'GOSJ950815HCSXNL03', '9935556677', 'Carmen Silva (Madre)', 't', 3, 1, '11223344556', 'f', NULL, NULL);
INSERT INTO "public"."personal" VALUES (4, '1f0994d0-47d1-42ca-b6d1-1c76f682e111', 'Sofía', 'Hernández Castro', 'HECS921101MDFXNL04', '9939998877', 'Luis Hernández (Hermano)', 't', 4, 1, '99887766554', 'f', NULL, NULL);
INSERT INTO "public"."personal" VALUES (5, '5b3e1a0b-9f98-4f2f-99e3-2d3d6b447a25', 'Pedro', 'Jiménez Damián', 'JIDP880228HCSXNL05', '9937778899', 'Rosa Damián (Madre)', 't', 3, 1, '55443322110', 'f', NULL, NULL);
INSERT INTO "public"."personal" VALUES (7, '613ac22d-e326-49eb-8fd0-f9b1cdaa8e2c', 'Faustino', 'Díaz Ocaña', 'DIOF821010HCSXNL07', '9332003040', NULL, 't', 3, 2, NULL, 't', 'SOC-202', NULL);
INSERT INTO "public"."personal" VALUES (8, '9468fd59-903b-48b6-a0ad-9a4555e915b3', 'Beatriz', 'López Méndez', 'LOMB950620MDFXNL08', '9334005060', NULL, 't', 4, 2, NULL, 'f', NULL, NULL);
INSERT INTO "public"."personal" VALUES (10, '8337fd49-5e4b-4ed6-af98-3ab72a8cae26', 'Israel', 'Hernández Ruiz', 'HERI881205HCSXNL10', '9935667788', NULL, 't', 3, 3, NULL, 't', 'SOC-302', NULL);
INSERT INTO "public"."personal" VALUES (11, '3495eafc-527e-4131-868f-77e0172eed0c', 'Lucía', 'García Torres', 'GATL980130MDFXNL11', '9938990011', NULL, 't', 5, 3, NULL, 'f', NULL, NULL);
INSERT INTO "public"."personal" VALUES (6, 'd3563f41-d29f-42d0-9fa6-bce568b09ac5', 'Cornelio', 'Pérez Izquierdo', 'PEIC750315HCSXNL06', '9331002030', NULL, 't', 1, 2, '88229900112', 't', 'SOC-201', 'CERT-2026-C2-01');
INSERT INTO "public"."personal" VALUES (9, 'f7918dd3-322e-42d0-b825-12296a8bd10c', 'Gustavo', 'Sánchez Cordero', 'SACG800412HCSXNL09', '9932445566', NULL, 't', 1, 3, '44556677889', 't', 'SOC-301', 'CERT-2026-C3-01');

-- ----------------------------
-- Table structure for rol
-- ----------------------------
DROP TABLE IF EXISTS "public"."rol";
CREATE TABLE "public"."rol" (
  "rol_id" int4 NOT NULL DEFAULT nextval('rol_rol_id_seq'::regclass),
  "rol_nombre" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "rol_puntos_reparto" numeric(4,2) DEFAULT 0.00
)
;

-- ----------------------------
-- Records of rol
-- ----------------------------
INSERT INTO "public"."rol" VALUES (1, 'Capitán', 3.00);
INSERT INTO "public"."rol" VALUES (2, 'Motorista', 2.00);
INSERT INTO "public"."rol" VALUES (3, 'Pescador (Marinero)', 1.00);
INSERT INTO "public"."rol" VALUES (4, 'Personal Administrativo', 0.00);
INSERT INTO "public"."rol" VALUES (5, 'Almacenista', 0.00);

-- ----------------------------
-- Table structure for venta
-- ----------------------------
DROP TABLE IF EXISTS "public"."venta";
CREATE TABLE "public"."venta" (
  "ven_id" int4 NOT NULL DEFAULT nextval('venta_ven_id_seq'::regclass),
  "ven_fecha" timestamp(6) DEFAULT CURRENT_TIMESTAMP,
  "ven_total" numeric(12,2) DEFAULT 0,
  "ven_tipo_pago" varchar(50) COLLATE "pg_catalog"."default",
  "ven_fk_cliente" int4 NOT NULL,
  "ven_fk_cooperativa" int4 NOT NULL
)
;

-- ----------------------------
-- Records of venta
-- ----------------------------
INSERT INTO "public"."venta" VALUES (1, '2026-04-25 12:30:00', 39362.50, 'Transferencia Electrónica', 1, 1);
INSERT INTO "public"."venta" VALUES (2, '2026-04-25 14:00:00', 3000.00, 'Efectivo', 2, 1);
INSERT INTO "public"."venta" VALUES (101, '2026-04-02 08:30:00', 45000.00, 'Transferencia Electrónica', 6, 1);
INSERT INTO "public"."venta" VALUES (102, '2026-04-03 11:15:00', 3450.00, 'Efectivo', 4, 1);
INSERT INTO "public"."venta" VALUES (103, '2026-04-05 09:00:00', 64000.00, 'Transferencia Electrónica', 1, 1);
INSERT INTO "public"."venta" VALUES (104, '2026-04-08 14:20:00', 1600.00, 'Efectivo', 5, 1);
INSERT INTO "public"."venta" VALUES (105, '2026-04-10 07:45:00', 125000.00, 'Transferencia Electrónica', 3, 1);
INSERT INTO "public"."venta" VALUES (106, '2026-04-12 10:30:00', 27000.00, 'Efectivo', 6, 1);
INSERT INTO "public"."venta" VALUES (107, '2026-04-15 13:00:00', 4800.00, 'Tarjeta de Débito', 7, 1);
INSERT INTO "public"."venta" VALUES (108, '2026-04-18 08:00:00', 88000.00, 'Transferencia Electrónica', 1, 1);
INSERT INTO "public"."venta" VALUES (109, '2026-04-21 15:45:00', 2750.00, 'Efectivo', 2, 1);
INSERT INTO "public"."venta" VALUES (110, '2026-04-26 09:30:00', 38000.00, 'Transferencia Electrónica', 3, 1);
INSERT INTO "public"."venta" VALUES (111, '2026-04-21 10:00:00', 25950.00, 'Efectivo', 7, 2);
INSERT INTO "public"."venta" VALUES (112, '2026-04-26 11:00:00', 25200.00, 'Transferencia Electrónica', 4, 3);
INSERT INTO "public"."venta" VALUES (201, '2026-04-10 09:00:00', 16250.00, 'Efectivo', 4, 2);
INSERT INTO "public"."venta" VALUES (202, '2026-04-12 11:30:00', 32500.00, 'Transferencia Electrónica', 6, 2);
INSERT INTO "public"."venta" VALUES (203, '2026-04-15 14:00:00', 5200.00, 'Efectivo', 5, 2);
INSERT INTO "public"."venta" VALUES (204, '2026-04-18 10:00:00', 19500.00, 'Transferencia Electrónica', 7, 2);
INSERT INTO "public"."venta" VALUES (205, '2026-04-22 08:45:00', 9750.00, 'Efectivo', 2, 2);
INSERT INTO "public"."venta" VALUES (206, '2026-04-25 12:00:00', 21125.00, 'Tarjeta de Débito', 4, 2);
INSERT INTO "public"."venta" VALUES (301, '2026-04-11 08:15:00', 15600.00, 'Transferencia Electrónica', 1, 3);
INSERT INTO "public"."venta" VALUES (302, '2026-04-13 13:00:00', 6500.00, 'Efectivo', 7, 3);
INSERT INTO "public"."venta" VALUES (303, '2026-04-16 09:30:00', 24000.00, 'Transferencia Electrónica', 3, 3);
INSERT INTO "public"."venta" VALUES (304, '2026-04-19 15:20:00', 4400.00, 'Efectivo', 5, 3);
INSERT INTO "public"."venta" VALUES (305, '2026-04-23 10:10:00', 19800.00, 'Transferencia Electrónica', 6, 3);
INSERT INTO "public"."venta" VALUES (306, '2026-04-26 14:40:00', 12100.00, 'Tarjeta de Débito', 2, 3);
INSERT INTO "public"."venta" VALUES (401, '2026-04-19 10:00:00', 105000.00, 'Transferencia Electrónica', 6, 1);
INSERT INTO "public"."venta" VALUES (402, '2026-04-23 11:00:00', 16560.00, 'Efectivo', 5, 2);

-- ----------------------------
-- Table structure for venta_detalle
-- ----------------------------
DROP TABLE IF EXISTS "public"."venta_detalle";
CREATE TABLE "public"."venta_detalle" (
  "ven_det_id" int4 NOT NULL DEFAULT nextval('venta_detalle_ven_det_id_seq'::regclass),
  "ven_det_fk_venta" int4 NOT NULL,
  "ven_det_fk_especie" int4 NOT NULL,
  "ven_det_kg" numeric(10,2) NOT NULL,
  "ven_det_precio_kg_venta" numeric(10,2) NOT NULL
)
;

-- ----------------------------
-- Records of venta_detalle
-- ----------------------------
INSERT INTO "public"."venta_detalle" VALUES (1, 1, 1, 120.50, 175.00);
INSERT INTO "public"."venta_detalle" VALUES (2, 1, 2, 85.00, 215.00);
INSERT INTO "public"."venta_detalle" VALUES (3, 2, 5, 40.00, 75.00);
INSERT INTO "public"."venta_detalle" VALUES (4, 101, 1, 100.00, 180.00);
INSERT INTO "public"."venta_detalle" VALUES (5, 101, 6, 50.00, 280.00);
INSERT INTO "public"."venta_detalle" VALUES (6, 101, 3, 50.00, 260.00);
INSERT INTO "public"."venta_detalle" VALUES (7, 102, 2, 10.00, 230.00);
INSERT INTO "public"."venta_detalle" VALUES (8, 102, 7, 10.00, 115.00);
INSERT INTO "public"."venta_detalle" VALUES (9, 103, 8, 200.00, 160.00);
INSERT INTO "public"."venta_detalle" VALUES (10, 103, 10, 100.00, 190.00);
INSERT INTO "public"."venta_detalle" VALUES (11, 103, 5, 100.00, 130.00);
INSERT INTO "public"."venta_detalle" VALUES (12, 104, 9, 10.00, 160.00);
INSERT INTO "public"."venta_detalle" VALUES (13, 105, 3, 200.00, 290.00);
INSERT INTO "public"."venta_detalle" VALUES (14, 105, 1, 300.00, 190.00);
INSERT INTO "public"."venta_detalle" VALUES (15, 105, 2, 40.00, 250.00);
INSERT INTO "public"."venta_detalle" VALUES (16, 106, 7, 100.00, 100.00);
INSERT INTO "public"."venta_detalle" VALUES (17, 106, 5, 200.00, 85.00);
INSERT INTO "public"."venta_detalle" VALUES (18, 107, 6, 15.00, 320.00);
INSERT INTO "public"."venta_detalle" VALUES (19, 108, 1, 400.00, 175.00);
INSERT INTO "public"."venta_detalle" VALUES (20, 108, 8, 100.00, 180.00);
INSERT INTO "public"."venta_detalle" VALUES (21, 109, 3, 5.00, 300.00);
INSERT INTO "public"."venta_detalle" VALUES (22, 109, 2, 5.00, 250.00);
INSERT INTO "public"."venta_detalle" VALUES (23, 110, 10, 200.00, 190.00);
INSERT INTO "public"."venta_detalle" VALUES (24, 111, 21, 350.00, 65.00);
INSERT INTO "public"."venta_detalle" VALUES (25, 111, 11, 80.00, 40.00);
INSERT INTO "public"."venta_detalle" VALUES (26, 112, 15, 120.00, 110.00);
INSERT INTO "public"."venta_detalle" VALUES (27, 112, 17, 250.00, 48.00);
INSERT INTO "public"."venta_detalle" VALUES (28, 201, 21, 250.00, 65.00);
INSERT INTO "public"."venta_detalle" VALUES (29, 202, 21, 500.00, 65.00);
INSERT INTO "public"."venta_detalle" VALUES (30, 203, 18, 65.00, 80.00);
INSERT INTO "public"."venta_detalle" VALUES (31, 204, 21, 300.00, 65.00);
INSERT INTO "public"."venta_detalle" VALUES (32, 205, 21, 150.00, 65.00);
INSERT INTO "public"."venta_detalle" VALUES (33, 206, 21, 250.00, 65.00);
INSERT INTO "public"."venta_detalle" VALUES (34, 206, 11, 100.00, 48.75);
INSERT INTO "public"."venta_detalle" VALUES (35, 301, 15, 120.00, 130.00);
INSERT INTO "public"."venta_detalle" VALUES (36, 302, 17, 100.00, 65.00);
INSERT INTO "public"."venta_detalle" VALUES (37, 303, 17, 400.00, 60.00);
INSERT INTO "public"."venta_detalle" VALUES (38, 304, 13, 25.00, 176.00);
INSERT INTO "public"."venta_detalle" VALUES (39, 305, 15, 150.00, 132.00);
INSERT INTO "public"."venta_detalle" VALUES (40, 306, 15, 50.00, 132.00);
INSERT INTO "public"."venta_detalle" VALUES (41, 306, 17, 100.00, 55.00);
INSERT INTO "public"."venta_detalle" VALUES (42, 401, 32, 500.00, 210.00);
INSERT INTO "public"."venta_detalle" VALUES (43, 402, 23, 120.00, 75.00);
INSERT INTO "public"."venta_detalle" VALUES (44, 402, 12, 180.00, 42.00);

-- ----------------------------
-- Table structure for viaje
-- ----------------------------
DROP TABLE IF EXISTS "public"."viaje";
CREATE TABLE "public"."viaje" (
  "via_id" int4 NOT NULL DEFAULT nextval('viaje_via_id_seq'::regclass),
  "via_fecha_salida" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "via_fecha_llegada" timestamp(6),
  "via_estatus" varchar(30) COLLATE "pg_catalog"."default" DEFAULT 'Pendiente'::character varying,
  "via_observaciones" text COLLATE "pg_catalog"."default",
  "via_fk_embarcacion" int4 NOT NULL,
  "via_fk_capitan" int4 NOT NULL,
  "via_fecha_estimada" date,
  "via_presupuesto_estimado" numeric(12,2) DEFAULT 0.00,
  "via_fk_zona" int4
)
;

-- ----------------------------
-- Records of viaje
-- ----------------------------
INSERT INTO "public"."viaje" VALUES (1, '2026-04-22 05:00:00', '2026-04-24 16:00:00', 'En Puerto', 'Buena pesca, clima favorable.', 1, 1, '2026-04-24', 15000.00, 1);
INSERT INTO "public"."viaje" VALUES (2, '2026-04-27 04:30:00', NULL, 'En Puerto', 'Reportaron oleaje moderado por la mañana.', 3, 1, '2026-04-30', 35000.00, 2);
INSERT INTO "public"."viaje" VALUES (23, '2026-04-28 00:19:39.306705', NULL, 'En Puerto', NULL, 1, 1, NULL, 45000.00, 1);
INSERT INTO "public"."viaje" VALUES (3, '2026-04-20 06:00:00', '2026-04-20 14:00:00', 'En Preparación', NULL, 4, 6, NULL, 0.00, 3);
INSERT INTO "public"."viaje" VALUES (10, '2026-04-20 07:00:00', '2026-04-20 15:00:00', 'En Curso', NULL, 4, 6, NULL, 1200.00, 3);
INSERT INTO "public"."viaje" VALUES (11, '2026-04-22 05:00:00', '2026-04-22 17:00:00', 'En Curso', NULL, 6, 9, NULL, 900.00, 1);
INSERT INTO "public"."viaje" VALUES (20, '2026-04-15 04:00:00', '2026-04-18 12:00:00', 'Cancelado', NULL, 3, 1, NULL, 25000.00, 2);
INSERT INTO "public"."viaje" VALUES (21, '2026-04-20 06:00:00', '2026-04-20 16:00:00', 'En Curso', NULL, 5, 6, NULL, 1000.00, 3);
INSERT INTO "public"."viaje" VALUES (22, '2026-04-22 07:00:00', '2026-04-22 15:00:00', 'En Curso', NULL, 7, 9, NULL, 800.00, 1);
INSERT INTO "public"."viaje" VALUES (4, '2026-04-25 05:30:00', '2026-04-25 15:00:00', 'Completado', NULL, 6, 9, NULL, 0.00, 1);

-- ----------------------------
-- Table structure for viaje_detalle_captura
-- ----------------------------
DROP TABLE IF EXISTS "public"."viaje_detalle_captura";
CREATE TABLE "public"."viaje_detalle_captura" (
  "det_cap_id" int4 NOT NULL DEFAULT nextval('viaje_detalle_captura_det_cap_id_seq'::regclass),
  "det_cap_fk_viaje" int4 NOT NULL,
  "det_cap_fk_especie" int4 NOT NULL,
  "det_cap_kilogramos" numeric(10,2) NOT NULL,
  "det_cap_precio_pactado" numeric(10,2) NOT NULL
)
;

-- ----------------------------
-- Records of viaje_detalle_captura
-- ----------------------------
INSERT INTO "public"."viaje_detalle_captura" VALUES (1, 1, 1, 120.50, 175.00);
INSERT INTO "public"."viaje_detalle_captura" VALUES (2, 1, 2, 85.00, 215.00);
INSERT INTO "public"."viaje_detalle_captura" VALUES (3, 1, 5, 40.00, 75.00);
INSERT INTO "public"."viaje_detalle_captura" VALUES (4, 3, 21, 350.00, 65.00);
INSERT INTO "public"."viaje_detalle_captura" VALUES (5, 3, 11, 80.00, 40.00);
INSERT INTO "public"."viaje_detalle_captura" VALUES (6, 4, 15, 120.00, 110.00);
INSERT INTO "public"."viaje_detalle_captura" VALUES (7, 4, 17, 250.00, 48.00);
INSERT INTO "public"."viaje_detalle_captura" VALUES (8, 20, 32, 500.00, 210.00);
INSERT INTO "public"."viaje_detalle_captura" VALUES (9, 21, 23, 120.00, 75.00);
INSERT INTO "public"."viaje_detalle_captura" VALUES (10, 22, 12, 180.00, 42.00);

-- ----------------------------
-- Table structure for viaje_gasto
-- ----------------------------
DROP TABLE IF EXISTS "public"."viaje_gasto";
CREATE TABLE "public"."viaje_gasto" (
  "gas_id" int4 NOT NULL DEFAULT nextval('viaje_gastos_gas_id_seq'::regclass),
  "gas_fk_viaje" int4 NOT NULL,
  "gas_fk_insumo" int4 NOT NULL,
  "gas_cantidad" numeric(10,2) NOT NULL,
  "gas_precio_unitario" numeric(10,2) NOT NULL,
  "gas_pagado_por_cooperativa" bool DEFAULT true
)
;

-- ----------------------------
-- Records of viaje_gasto
-- ----------------------------
INSERT INTO "public"."viaje_gasto" VALUES (1, 1, 1, 200.00, 24.50, 't');
INSERT INTO "public"."viaje_gasto" VALUES (2, 1, 2, 1.50, 850.00, 't');
INSERT INTO "public"."viaje_gasto" VALUES (3, 1, 3, 30.00, 35.00, 't');
INSERT INTO "public"."viaje_gasto" VALUES (4, 10, 1, 30.00, 24.50, 't');
INSERT INTO "public"."viaje_gasto" VALUES (5, 10, 2, 0.50, 850.00, 't');
INSERT INTO "public"."viaje_gasto" VALUES (6, 11, 1, 15.00, 24.50, 't');
INSERT INTO "public"."viaje_gasto" VALUES (7, 11, 4, 2.00, 120.00, 't');
INSERT INTO "public"."viaje_gasto" VALUES (8, 20, 1, 600.00, 24.50, 't');
INSERT INTO "public"."viaje_gasto" VALUES (9, 20, 2, 2.50, 850.00, 't');
INSERT INTO "public"."viaje_gasto" VALUES (10, 21, 1, 25.00, 24.50, 't');
INSERT INTO "public"."viaje_gasto" VALUES (11, 22, 1, 15.00, 24.50, 't');

-- ----------------------------
-- Table structure for zona_pesca
-- ----------------------------
DROP TABLE IF EXISTS "public"."zona_pesca";
CREATE TABLE "public"."zona_pesca" (
  "zona_id" int4 NOT NULL DEFAULT nextval('cat_zona_pesca_zon_id_seq'::regclass),
  "zona_nombre" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "zona_cuadrante" varchar(50) COLLATE "pg_catalog"."default",
  "zona_descripcion" text COLLATE "pg_catalog"."default",
  "zona_estatus" bool DEFAULT true
)
;

-- ----------------------------
-- Records of zona_pesca
-- ----------------------------
INSERT INTO "public"."zona_pesca" VALUES (1, 'Litoral de Frontera', 'TAB-01', 'Aguas costeras frente al puerto de Frontera, Tabasco.', 't');
INSERT INTO "public"."zona_pesca" VALUES (2, 'Sonda de Campeche', 'CAM-05', 'Zona de alta concentración de especies comerciales, precaución por plataformas.', 't');
INSERT INTO "public"."zona_pesca" VALUES (3, 'Barra de Tupilco', 'TAB-02', 'Zona de captura de ostión y especies de estuario.', 't');
INSERT INTO "public"."zona_pesca" VALUES (4, 'Dos Bocas - Litoral', 'TAB-03', 'Ruta de navegación con áreas de pesca delimitadas.', 't');

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."activos_fijos_act_id_seq"
OWNED BY "public"."activos_fijos"."act_id";
SELECT setval('"public"."activos_fijos_act_id_seq"', 12, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."alerta_sistema_ale_id_seq"
OWNED BY "public"."alerta_sistema"."ale_id";
SELECT setval('"public"."alerta_sistema_ale_id_seq"', 4, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."cat_tipo_activo_tip_act_id_seq"
OWNED BY "public"."cat_tipo_activo"."tip_act_id";
SELECT setval('"public"."cat_tipo_activo_tip_act_id_seq"', 5, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."cat_tipo_instalacion_tip_inst_id_seq"
OWNED BY "public"."cat_tipo_instalacion"."tip_inst_id";
SELECT setval('"public"."cat_tipo_instalacion_tip_inst_id_seq"', 4, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."cat_zona_pesca_zon_id_seq"
OWNED BY "public"."zona_pesca"."zona_id";
SELECT setval('"public"."cat_zona_pesca_zon_id_seq"', 4, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."categoria_especie_cat_esp_id_seq"
OWNED BY "public"."categoria_especie"."cat_esp_id";
SELECT setval('"public"."categoria_especie_cat_esp_id_seq"', 9, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."clientes_cli_id_seq"
OWNED BY "public"."clientes"."cli_id";
SELECT setval('"public"."clientes_cli_id_seq"', 7, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."contrato_historial_con_id_seq"
OWNED BY "public"."contrato_historial"."con_id";
SELECT setval('"public"."contrato_historial_con_id_seq"', 4, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."cooperativas_coop_id_seq"
OWNED BY "public"."cooperativa"."coop_id";
SELECT setval('"public"."cooperativas_coop_id_seq"', 3, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."embarcacion_emb_id_seq"
OWNED BY "public"."embarcacion"."emb_id";
SELECT setval('"public"."embarcacion_emb_id_seq"', 7, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."especie_esp_id_seq"
OWNED BY "public"."especie"."esp_id";
SELECT setval('"public"."especie_esp_id_seq"', 34, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."instalacion_inst_id_seq"
OWNED BY "public"."instalacion"."inst_id";
SELECT setval('"public"."instalacion_inst_id_seq"', 7, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."insumo_ins_id_seq"
OWNED BY "public"."insumo"."ins_id";
SELECT setval('"public"."insumo_ins_id_seq"', 5, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."inventario_insumos_inv_id_seq"
OWNED BY "public"."inventario_insumos"."inv_id";
SELECT setval('"public"."inventario_insumos_inv_id_seq"', 7, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."liquidacion_viaje_liq_id_seq"
OWNED BY "public"."liquidacion_viaje"."liq_id";
SELECT setval('"public"."liquidacion_viaje_liq_id_seq"', 8, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."movimientos_inventario_mov_id_seq"
OWNED BY "public"."movimientos_inventario"."mov_id";
SELECT setval('"public"."movimientos_inventario_mov_id_seq"', 4, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."pago_tripulacion_pag_id_seq"
OWNED BY "public"."pago_tripulacion"."pag_id";
SELECT setval('"public"."pago_tripulacion_pag_id_seq"', 10, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."permiso_detalle_especie_per_det_id_seq"
OWNED BY "public"."permiso_detalle_especie"."per_det_id";
SELECT setval('"public"."permiso_detalle_especie_per_det_id_seq"', 13, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."permisos_pesca_per_pes_id_seq"
OWNED BY "public"."permisos_pesca"."per_pes_id";
SELECT setval('"public"."permisos_pesca_per_pes_id_seq"', 4, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."personal_per_id_seq"
OWNED BY "public"."personal"."per_id";
SELECT setval('"public"."personal_per_id_seq"', 11, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."rol_rol_id_seq"
OWNED BY "public"."rol"."rol_id";
SELECT setval('"public"."rol_rol_id_seq"', 5, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."venta_detalle_ven_det_id_seq"
OWNED BY "public"."venta_detalle"."ven_det_id";
SELECT setval('"public"."venta_detalle_ven_det_id_seq"', 44, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."venta_ven_id_seq"
OWNED BY "public"."venta"."ven_id";
SELECT setval('"public"."venta_ven_id_seq"', 402, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."viaje_detalle_captura_det_cap_id_seq"
OWNED BY "public"."viaje_detalle_captura"."det_cap_id";
SELECT setval('"public"."viaje_detalle_captura_det_cap_id_seq"', 10, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."viaje_gastos_gas_id_seq"
OWNED BY "public"."viaje_gasto"."gas_id";
SELECT setval('"public"."viaje_gastos_gas_id_seq"', 11, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."viaje_via_id_seq"
OWNED BY "public"."viaje"."via_id";
SELECT setval('"public"."viaje_via_id_seq"', 24, true);

-- ----------------------------
-- Uniques structure for table activos_fijos
-- ----------------------------
ALTER TABLE "public"."activos_fijos" ADD CONSTRAINT "activos_fijos_act_num_serie_o_placa_key" UNIQUE ("act_num_serie_o_placa");

-- ----------------------------
-- Primary Key structure for table activos_fijos
-- ----------------------------
ALTER TABLE "public"."activos_fijos" ADD CONSTRAINT "activos_fijos_pkey" PRIMARY KEY ("act_id");

-- ----------------------------
-- Checks structure for table alerta_sistema
-- ----------------------------
ALTER TABLE "public"."alerta_sistema" ADD CONSTRAINT "alerta_sistema_ale_nivel_riesgo_check" CHECK (ale_nivel_riesgo::text = ANY (ARRAY['Bajo'::character varying::text, 'Medio'::character varying::text, 'Crítico'::character varying::text]));

-- ----------------------------
-- Primary Key structure for table alerta_sistema
-- ----------------------------
ALTER TABLE "public"."alerta_sistema" ADD CONSTRAINT "alerta_sistema_pkey" PRIMARY KEY ("ale_id");

-- ----------------------------
-- Checks structure for table bitacora_mantenimiento
-- ----------------------------
ALTER TABLE "public"."bitacora_mantenimiento" ADD CONSTRAINT "bitacora_mantenimiento_mant_tipo_check" CHECK (mant_tipo::text = ANY (ARRAY['Preventivo'::character varying::text, 'Correctivo'::character varying::text, 'Urgencia'::character varying::text]));

-- ----------------------------
-- Primary Key structure for table bitacora_mantenimiento
-- ----------------------------
ALTER TABLE "public"."bitacora_mantenimiento" ADD CONSTRAINT "bitacora_mantenimiento_pkey" PRIMARY KEY ("mant_id");

-- ----------------------------
-- Uniques structure for table cat_tipo_activo
-- ----------------------------
ALTER TABLE "public"."cat_tipo_activo" ADD CONSTRAINT "cat_tipo_activo_tip_act_nombre_key" UNIQUE ("tip_act_nombre");

-- ----------------------------
-- Primary Key structure for table cat_tipo_activo
-- ----------------------------
ALTER TABLE "public"."cat_tipo_activo" ADD CONSTRAINT "cat_tipo_activo_pkey" PRIMARY KEY ("tip_act_id");

-- ----------------------------
-- Uniques structure for table cat_tipo_instalacion
-- ----------------------------
ALTER TABLE "public"."cat_tipo_instalacion" ADD CONSTRAINT "cat_tipo_instalacion_tip_inst_nombre_key" UNIQUE ("tip_inst_nombre");

-- ----------------------------
-- Primary Key structure for table cat_tipo_instalacion
-- ----------------------------
ALTER TABLE "public"."cat_tipo_instalacion" ADD CONSTRAINT "cat_tipo_instalacion_pkey" PRIMARY KEY ("tip_inst_id");

-- ----------------------------
-- Uniques structure for table categoria_especie
-- ----------------------------
ALTER TABLE "public"."categoria_especie" ADD CONSTRAINT "categoria_especie_cat_esp_nombre_key" UNIQUE ("cat_esp_nombre");

-- ----------------------------
-- Primary Key structure for table categoria_especie
-- ----------------------------
ALTER TABLE "public"."categoria_especie" ADD CONSTRAINT "categoria_especie_pkey" PRIMARY KEY ("cat_esp_id");

-- ----------------------------
-- Checks structure for table clientes
-- ----------------------------
ALTER TABLE "public"."clientes" ADD CONSTRAINT "clientes_cli_tipo_check" CHECK (cli_tipo::text = ANY (ARRAY['Mayoreo'::character varying::text, 'Menudeo'::character varying::text]));

-- ----------------------------
-- Primary Key structure for table clientes
-- ----------------------------
ALTER TABLE "public"."clientes" ADD CONSTRAINT "clientes_pkey" PRIMARY KEY ("cli_id");

-- ----------------------------
-- Primary Key structure for table contrato_historial
-- ----------------------------
ALTER TABLE "public"."contrato_historial" ADD CONSTRAINT "contrato_historial_pkey" PRIMARY KEY ("con_id");

-- ----------------------------
-- Primary Key structure for table cooperativa
-- ----------------------------
ALTER TABLE "public"."cooperativa" ADD CONSTRAINT "cooperativas_pkey" PRIMARY KEY ("coop_id");

-- ----------------------------
-- Uniques structure for table embarcacion
-- ----------------------------
ALTER TABLE "public"."embarcacion" ADD CONSTRAINT "embarcacion_emb_matricula_key" UNIQUE ("emb_matricula");

-- ----------------------------
-- Primary Key structure for table embarcacion
-- ----------------------------
ALTER TABLE "public"."embarcacion" ADD CONSTRAINT "embarcacion_pkey" PRIMARY KEY ("emb_id");

-- ----------------------------
-- Primary Key structure for table especie
-- ----------------------------
ALTER TABLE "public"."especie" ADD CONSTRAINT "especie_pkey" PRIMARY KEY ("esp_id");

-- ----------------------------
-- Primary Key structure for table instalacion
-- ----------------------------
ALTER TABLE "public"."instalacion" ADD CONSTRAINT "ubicacion_pkey" PRIMARY KEY ("inst_id");

-- ----------------------------
-- Primary Key structure for table insumo
-- ----------------------------
ALTER TABLE "public"."insumo" ADD CONSTRAINT "insumo_pkey" PRIMARY KEY ("ins_id");

-- ----------------------------
-- Uniques structure for table inventario_insumos
-- ----------------------------
ALTER TABLE "public"."inventario_insumos" ADD CONSTRAINT "unq_ubicacion_insumo" UNIQUE ("inv_fk_instalacion", "inv_fk_insumo");

-- ----------------------------
-- Primary Key structure for table inventario_insumos
-- ----------------------------
ALTER TABLE "public"."inventario_insumos" ADD CONSTRAINT "inventario_insumos_pkey" PRIMARY KEY ("inv_id");

-- ----------------------------
-- Uniques structure for table liquidacion_viaje
-- ----------------------------
ALTER TABLE "public"."liquidacion_viaje" ADD CONSTRAINT "liquidacion_viaje_liq_fk_viaje_key" UNIQUE ("liq_fk_viaje");

-- ----------------------------
-- Primary Key structure for table liquidacion_viaje
-- ----------------------------
ALTER TABLE "public"."liquidacion_viaje" ADD CONSTRAINT "liquidacion_viaje_pkey" PRIMARY KEY ("liq_id");

-- ----------------------------
-- Checks structure for table movimientos_inventario
-- ----------------------------
ALTER TABLE "public"."movimientos_inventario" ADD CONSTRAINT "movimientos_inventario_mov_tipo_check" CHECK (mov_tipo::text = ANY (ARRAY['Entrada'::character varying::text, 'Salida'::character varying::text, 'Ajuste'::character varying::text]));

-- ----------------------------
-- Primary Key structure for table movimientos_inventario
-- ----------------------------
ALTER TABLE "public"."movimientos_inventario" ADD CONSTRAINT "movimientos_inventario_pkey" PRIMARY KEY ("mov_id");

-- ----------------------------
-- Primary Key structure for table pago_tripulacion
-- ----------------------------
ALTER TABLE "public"."pago_tripulacion" ADD CONSTRAINT "pago_tripulacion_pkey" PRIMARY KEY ("pag_id");

-- ----------------------------
-- Uniques structure for table permiso_detalle_especie
-- ----------------------------
ALTER TABLE "public"."permiso_detalle_especie" ADD CONSTRAINT "unq_permiso_especie" UNIQUE ("per_det_fk_permiso", "per_det_fk_especie");

-- ----------------------------
-- Primary Key structure for table permiso_detalle_especie
-- ----------------------------
ALTER TABLE "public"."permiso_detalle_especie" ADD CONSTRAINT "permiso_detalle_especie_pkey" PRIMARY KEY ("per_det_id");

-- ----------------------------
-- Uniques structure for table permisos_pesca
-- ----------------------------
ALTER TABLE "public"."permisos_pesca" ADD CONSTRAINT "permisos_pesca_per_pes_folio_key" UNIQUE ("per_pes_folio");

-- ----------------------------
-- Primary Key structure for table permisos_pesca
-- ----------------------------
ALTER TABLE "public"."permisos_pesca" ADD CONSTRAINT "permisos_pesca_pkey" PRIMARY KEY ("per_pes_id");

-- ----------------------------
-- Primary Key structure for table personal
-- ----------------------------
ALTER TABLE "public"."personal" ADD CONSTRAINT "personal_pkey" PRIMARY KEY ("per_id");

-- ----------------------------
-- Uniques structure for table rol
-- ----------------------------
ALTER TABLE "public"."rol" ADD CONSTRAINT "rol_rol_nombre_key" UNIQUE ("rol_nombre");

-- ----------------------------
-- Primary Key structure for table rol
-- ----------------------------
ALTER TABLE "public"."rol" ADD CONSTRAINT "rol_pkey" PRIMARY KEY ("rol_id");

-- ----------------------------
-- Primary Key structure for table venta
-- ----------------------------
ALTER TABLE "public"."venta" ADD CONSTRAINT "venta_pkey" PRIMARY KEY ("ven_id");

-- ----------------------------
-- Primary Key structure for table venta_detalle
-- ----------------------------
ALTER TABLE "public"."venta_detalle" ADD CONSTRAINT "venta_detalle_pkey" PRIMARY KEY ("ven_det_id");

-- ----------------------------
-- Primary Key structure for table viaje
-- ----------------------------
ALTER TABLE "public"."viaje" ADD CONSTRAINT "viaje_pkey" PRIMARY KEY ("via_id");

-- ----------------------------
-- Primary Key structure for table viaje_detalle_captura
-- ----------------------------
ALTER TABLE "public"."viaje_detalle_captura" ADD CONSTRAINT "viaje_detalle_captura_pkey" PRIMARY KEY ("det_cap_id");

-- ----------------------------
-- Primary Key structure for table viaje_gasto
-- ----------------------------
ALTER TABLE "public"."viaje_gasto" ADD CONSTRAINT "viaje_gastos_pkey" PRIMARY KEY ("gas_id");

-- ----------------------------
-- Uniques structure for table zona_pesca
-- ----------------------------
ALTER TABLE "public"."zona_pesca" ADD CONSTRAINT "cat_zona_pesca_zon_nombre_key" UNIQUE ("zona_nombre");

-- ----------------------------
-- Primary Key structure for table zona_pesca
-- ----------------------------
ALTER TABLE "public"."zona_pesca" ADD CONSTRAINT "cat_zona_pesca_pkey" PRIMARY KEY ("zona_id");

-- ----------------------------
-- Foreign Keys structure for table activos_fijos
-- ----------------------------
ALTER TABLE "public"."activos_fijos" ADD CONSTRAINT "fk_activo_cooperativa" FOREIGN KEY ("act_fk_cooperativa") REFERENCES "public"."cooperativa" ("coop_id") ON DELETE RESTRICT ON UPDATE NO ACTION;
ALTER TABLE "public"."activos_fijos" ADD CONSTRAINT "fk_activo_embarcacion" FOREIGN KEY ("act_fk_embarcacion") REFERENCES "public"."embarcacion" ("emb_id") ON DELETE SET NULL ON UPDATE NO ACTION;
ALTER TABLE "public"."activos_fijos" ADD CONSTRAINT "fk_activo_tipo" FOREIGN KEY ("act_fk_tipo") REFERENCES "public"."cat_tipo_activo" ("tip_act_id") ON DELETE RESTRICT ON UPDATE NO ACTION;
ALTER TABLE "public"."activos_fijos" ADD CONSTRAINT "fk_activo_ubicacion" FOREIGN KEY ("act_fk_instalacion") REFERENCES "public"."instalacion" ("inst_id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table alerta_sistema
-- ----------------------------
ALTER TABLE "public"."alerta_sistema" ADD CONSTRAINT "fk_alerta_embarcacion" FOREIGN KEY ("ale_fk_embarcacion") REFERENCES "public"."embarcacion" ("emb_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table bitacora_mantenimiento
-- ----------------------------
ALTER TABLE "public"."bitacora_mantenimiento" ADD CONSTRAINT "fk_mant_embarcacion" FOREIGN KEY ("mant_fk_embarcacion") REFERENCES "public"."embarcacion" ("emb_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table clientes
-- ----------------------------
ALTER TABLE "public"."clientes" ADD CONSTRAINT "fk_cliente_cooperativa" FOREIGN KEY ("cli_fk_cooperativa") REFERENCES "public"."cooperativa" ("coop_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table contrato_historial
-- ----------------------------
ALTER TABLE "public"."contrato_historial" ADD CONSTRAINT "fk_contrato_personal" FOREIGN KEY ("con_fk_personal") REFERENCES "public"."personal" ("per_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table cooperativa
-- ----------------------------
ALTER TABLE "public"."cooperativa" ADD CONSTRAINT "cooperativa_coop_fk_ubicacion_fkey" FOREIGN KEY ("coop_fk_instalacion") REFERENCES "public"."instalacion" ("inst_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- ----------------------------
-- Foreign Keys structure for table embarcacion
-- ----------------------------
ALTER TABLE "public"."embarcacion" ADD CONSTRAINT "fk_emb_cooperativa" FOREIGN KEY ("emb_fk_cooperativa") REFERENCES "public"."cooperativa" ("coop_id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "public"."embarcacion" ADD CONSTRAINT "fk_emb_ubicacion" FOREIGN KEY ("emb_fk_instalacion_base") REFERENCES "public"."instalacion" ("inst_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- ----------------------------
-- Foreign Keys structure for table especie
-- ----------------------------
ALTER TABLE "public"."especie" ADD CONSTRAINT "fk_especie_categoria" FOREIGN KEY ("esp_fk_categoria") REFERENCES "public"."categoria_especie" ("cat_esp_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- ----------------------------
-- Foreign Keys structure for table instalacion
-- ----------------------------
ALTER TABLE "public"."instalacion" ADD CONSTRAINT "fk_instalacion_tipo" FOREIGN KEY ("inst_fk_tipo") REFERENCES "public"."cat_tipo_instalacion" ("tip_inst_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table inventario_insumos
-- ----------------------------
ALTER TABLE "public"."inventario_insumos" ADD CONSTRAINT "fk_inv_insumo" FOREIGN KEY ("inv_fk_insumo") REFERENCES "public"."insumo" ("ins_id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "public"."inventario_insumos" ADD CONSTRAINT "fk_inv_ubicacion" FOREIGN KEY ("inv_fk_instalacion") REFERENCES "public"."instalacion" ("inst_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table liquidacion_viaje
-- ----------------------------
ALTER TABLE "public"."liquidacion_viaje" ADD CONSTRAINT "fk_liquidacion_viaje" FOREIGN KEY ("liq_fk_viaje") REFERENCES "public"."viaje" ("via_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table movimientos_inventario
-- ----------------------------
ALTER TABLE "public"."movimientos_inventario" ADD CONSTRAINT "fk_mov_insumo" FOREIGN KEY ("mov_fk_insumo") REFERENCES "public"."insumo" ("ins_id") ON DELETE RESTRICT ON UPDATE NO ACTION;
ALTER TABLE "public"."movimientos_inventario" ADD CONSTRAINT "fk_mov_personal" FOREIGN KEY ("mov_fk_personal") REFERENCES "public"."personal" ("per_id") ON DELETE RESTRICT ON UPDATE NO ACTION;
ALTER TABLE "public"."movimientos_inventario" ADD CONSTRAINT "fk_mov_ubicacion" FOREIGN KEY ("mov_fk_instalacion") REFERENCES "public"."instalacion" ("inst_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table pago_tripulacion
-- ----------------------------
ALTER TABLE "public"."pago_tripulacion" ADD CONSTRAINT "fk_pago_liquidacion" FOREIGN KEY ("pag_fk_liquidacion") REFERENCES "public"."liquidacion_viaje" ("liq_id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "public"."pago_tripulacion" ADD CONSTRAINT "fk_pago_personal" FOREIGN KEY ("pag_fk_personal") REFERENCES "public"."personal" ("per_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table permiso_detalle_especie
-- ----------------------------
ALTER TABLE "public"."permiso_detalle_especie" ADD CONSTRAINT "fk_permiso_detalle" FOREIGN KEY ("per_det_fk_permiso") REFERENCES "public"."permisos_pesca" ("per_pes_id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "public"."permiso_detalle_especie" ADD CONSTRAINT "fk_permiso_especie" FOREIGN KEY ("per_det_fk_especie") REFERENCES "public"."especie" ("esp_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table permisos_pesca
-- ----------------------------
ALTER TABLE "public"."permisos_pesca" ADD CONSTRAINT "fk_permiso_cooperativa" FOREIGN KEY ("per_pes_fk_cooperativa") REFERENCES "public"."cooperativa" ("coop_id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "public"."permisos_pesca" ADD CONSTRAINT "fk_permiso_embarcacion" FOREIGN KEY ("per_pes_fk_embarcacion") REFERENCES "public"."embarcacion" ("emb_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table personal
-- ----------------------------
ALTER TABLE "public"."personal" ADD CONSTRAINT "fk_personal_cooperativa" FOREIGN KEY ("per_fk_cooperativa") REFERENCES "public"."cooperativa" ("coop_id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "public"."personal" ADD CONSTRAINT "fk_personal_rol" FOREIGN KEY ("per_fk_rol") REFERENCES "public"."rol" ("rol_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- ----------------------------
-- Foreign Keys structure for table venta
-- ----------------------------
ALTER TABLE "public"."venta" ADD CONSTRAINT "fk_venta_cliente" FOREIGN KEY ("ven_fk_cliente") REFERENCES "public"."clientes" ("cli_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "public"."venta" ADD CONSTRAINT "fk_venta_cooperativa" FOREIGN KEY ("ven_fk_cooperativa") REFERENCES "public"."cooperativa" ("coop_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table venta_detalle
-- ----------------------------
ALTER TABLE "public"."venta_detalle" ADD CONSTRAINT "fk_detalle_especie_venta" FOREIGN KEY ("ven_det_fk_especie") REFERENCES "public"."especie" ("esp_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "public"."venta_detalle" ADD CONSTRAINT "fk_detalle_venta" FOREIGN KEY ("ven_det_fk_venta") REFERENCES "public"."venta" ("ven_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table viaje
-- ----------------------------
ALTER TABLE "public"."viaje" ADD CONSTRAINT "fk_viaje_capitan" FOREIGN KEY ("via_fk_capitan") REFERENCES "public"."personal" ("per_id") ON DELETE RESTRICT ON UPDATE NO ACTION;
ALTER TABLE "public"."viaje" ADD CONSTRAINT "fk_viaje_embarcacion" FOREIGN KEY ("via_fk_embarcacion") REFERENCES "public"."embarcacion" ("emb_id") ON DELETE RESTRICT ON UPDATE NO ACTION;
ALTER TABLE "public"."viaje" ADD CONSTRAINT "fk_viaje_zona" FOREIGN KEY ("via_fk_zona") REFERENCES "public"."zona_pesca" ("zona_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table viaje_detalle_captura
-- ----------------------------
ALTER TABLE "public"."viaje_detalle_captura" ADD CONSTRAINT "fk_detalle_especie" FOREIGN KEY ("det_cap_fk_especie") REFERENCES "public"."especie" ("esp_id") ON DELETE RESTRICT ON UPDATE NO ACTION;
ALTER TABLE "public"."viaje_detalle_captura" ADD CONSTRAINT "fk_detalle_viaje" FOREIGN KEY ("det_cap_fk_viaje") REFERENCES "public"."viaje" ("via_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table viaje_gasto
-- ----------------------------
ALTER TABLE "public"."viaje_gasto" ADD CONSTRAINT "fk_gasto_insumo" FOREIGN KEY ("gas_fk_insumo") REFERENCES "public"."insumo" ("ins_id") ON DELETE RESTRICT ON UPDATE NO ACTION;
ALTER TABLE "public"."viaje_gasto" ADD CONSTRAINT "fk_gasto_viaje" FOREIGN KEY ("gas_fk_viaje") REFERENCES "public"."viaje" ("via_id") ON DELETE CASCADE ON UPDATE NO ACTION;
