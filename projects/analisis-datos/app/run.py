#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Script para iniciar la aplicación de análisis de datos.
Este script importa la aplicación Flask desde app.py y la ejecuta.
"""

from app import app

if __name__ == '__main__':
    # Iniciar la aplicación en modo de desarrollo
    app.run(debug=True, host='0.0.0.0', port=5000)