# backend/api/serializers_auth.py

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Serializador personalizado que fuerza a JWT a usar 'correo' 
    en lugar del campo 'username' por defecto para la autenticación.
    """
    # Sobreescribe el campo de username para usar el campo 'correo'
    username_field = 'correo'