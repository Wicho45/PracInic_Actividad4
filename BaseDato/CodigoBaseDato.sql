-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema praini
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema praini
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `praini` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci ;
USE `praini` ;

-- -----------------------------------------------------
-- Table `praini`.`usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `praini`.`usuario` (
  `Correo` VARCHAR(100) NOT NULL,
  `Contrasena` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`Correo`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;


-- -----------------------------------------------------
-- Table `praini`.`alumno`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `praini`.`alumno` (
  `Registro_Academico` VARCHAR(50) NOT NULL,
  `Nombre` VARCHAR(100) NOT NULL,
  `Apellido` VARCHAR(100) NOT NULL,
  `Correo` VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (`Registro_Academico`),
  UNIQUE INDEX `Correo` (`Correo` ASC) VISIBLE,
  CONSTRAINT `alumno_ibfk_1`
    FOREIGN KEY (`Correo`)
    REFERENCES `praini`.`usuario` (`Correo`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;


-- -----------------------------------------------------
-- Table `praini`.`curso`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `praini`.`curso` (
  `ID_Curso` INT NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(100) NOT NULL,
  `Creditos` INT NOT NULL,
  `Registro_Academico` VARCHAR(50) NULL DEFAULT NULL,
  PRIMARY KEY (`ID_Curso`),
  INDEX `Registro_Academico` (`Registro_Academico` ASC) VISIBLE,
  CONSTRAINT `curso_ibfk_1`
    FOREIGN KEY (`Registro_Academico`)
    REFERENCES `praini`.`alumno` (`Registro_Academico`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;


-- -----------------------------------------------------
-- Table `praini`.`aprobadas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `praini`.`aprobadas` (
  `ID_Aprobada` INT NOT NULL AUTO_INCREMENT,
  `Nota` DECIMAL(5,2) NULL DEFAULT NULL,
  `Estado` VARCHAR(20) NULL DEFAULT NULL,
  `Registro_Academico` VARCHAR(50) NULL DEFAULT NULL,
  `ID_Curso` INT NULL DEFAULT NULL,
  PRIMARY KEY (`ID_Aprobada`),
  INDEX `Registro_Academico` (`Registro_Academico` ASC) VISIBLE,
  INDEX `ID_Curso` (`ID_Curso` ASC) VISIBLE,
  CONSTRAINT `aprobadas_ibfk_1`
    FOREIGN KEY (`Registro_Academico`)
    REFERENCES `praini`.`alumno` (`Registro_Academico`),
  CONSTRAINT `aprobadas_ibfk_2`
    FOREIGN KEY (`ID_Curso`)
    REFERENCES `praini`.`curso` (`ID_Curso`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;


-- -----------------------------------------------------
-- Table `praini`.`profesor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `praini`.`profesor` (
  `ID_Profesor` INT NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(100) NOT NULL,
  `Apellido` VARCHAR(100) NOT NULL,
  `Correo` VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (`ID_Profesor`),
  UNIQUE INDEX `Correo` (`Correo` ASC) VISIBLE,
  CONSTRAINT `profesor_ibfk_1`
    FOREIGN KEY (`Correo`)
    REFERENCES `praini`.`usuario` (`Correo`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;


-- -----------------------------------------------------
-- Table `praini`.`comentarios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `praini`.`comentarios` (
  `ID_Desempeno` INT NOT NULL AUTO_INCREMENT,
  `Nota` DECIMAL(5,2) NULL DEFAULT NULL,
  `Fecha_Calificacion` DATE NULL DEFAULT NULL,
  `ID_Profesor` INT NULL DEFAULT NULL,
  `ID_Curso` INT NULL DEFAULT NULL,
  `Registro_Academico` VARCHAR(50) NULL DEFAULT NULL,
  PRIMARY KEY (`ID_Desempeno`),
  INDEX `ID_Profesor` (`ID_Profesor` ASC) VISIBLE,
  INDEX `ID_Curso` (`ID_Curso` ASC) VISIBLE,
  INDEX `Registro_Academico` (`Registro_Academico` ASC) VISIBLE,
  CONSTRAINT `comentarios_ibfk_1`
    FOREIGN KEY (`ID_Profesor`)
    REFERENCES `praini`.`profesor` (`ID_Profesor`),
  CONSTRAINT `comentarios_ibfk_2`
    FOREIGN KEY (`ID_Curso`)
    REFERENCES `praini`.`curso` (`ID_Curso`),
  CONSTRAINT `comentarios_ibfk_3`
    FOREIGN KEY (`Registro_Academico`)
    REFERENCES `praini`.`alumno` (`Registro_Academico`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;


-- -----------------------------------------------------
-- Table `praini`.`publicacion`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `praini`.`publicacion` (
  `ID_Publicacion` INT NOT NULL AUTO_INCREMENT,
  `Correo` VARCHAR(100) NULL DEFAULT NULL,
  `ID_Profesor` INT NULL DEFAULT NULL,
  `Mensaje` TEXT NOT NULL,
  `Fecha` DATE NOT NULL,
  PRIMARY KEY (`ID_Publicacion`),
  INDEX `Correo` (`Correo` ASC) VISIBLE,
  INDEX `ID_Profesor` (`ID_Profesor` ASC) VISIBLE,
  CONSTRAINT `publicacion_ibfk_1`
    FOREIGN KEY (`Correo`)
    REFERENCES `praini`.`usuario` (`Correo`),
  CONSTRAINT `publicacion_ibfk_2`
    FOREIGN KEY (`ID_Profesor`)
    REFERENCES `praini`.`profesor` (`ID_Profesor`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;


-- -----------------------------------------------------
-- Table `praini`.`seccion`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `praini`.`seccion` (
  `ID_Seccion` INT NOT NULL AUTO_INCREMENT,
  `Registro_Academico` VARCHAR(50) NULL DEFAULT NULL,
  `ID_Profesor` INT NULL DEFAULT NULL,
  `ID_Curso` INT NULL DEFAULT NULL,
  `ID_Publicacion` INT NULL DEFAULT NULL,
  PRIMARY KEY (`ID_Seccion`),
  INDEX `Registro_Academico` (`Registro_Academico` ASC) VISIBLE,
  INDEX `ID_Profesor` (`ID_Profesor` ASC) VISIBLE,
  INDEX `ID_Curso` (`ID_Curso` ASC) VISIBLE,
  INDEX `ID_Publicacion` (`ID_Publicacion` ASC) VISIBLE,
  CONSTRAINT `seccion_ibfk_1`
    FOREIGN KEY (`Registro_Academico`)
    REFERENCES `praini`.`alumno` (`Registro_Academico`),
  CONSTRAINT `seccion_ibfk_2`
    FOREIGN KEY (`ID_Profesor`)
    REFERENCES `praini`.`profesor` (`ID_Profesor`),
  CONSTRAINT `seccion_ibfk_3`
    FOREIGN KEY (`ID_Curso`)
    REFERENCES `praini`.`curso` (`ID_Curso`),
  CONSTRAINT `seccion_ibfk_4`
    FOREIGN KEY (`ID_Publicacion`)
    REFERENCES `praini`.`publicacion` (`ID_Publicacion`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
