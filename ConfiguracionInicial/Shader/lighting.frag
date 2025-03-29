#version 330 core

struct Material
{
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    float shininess;
};

struct Light
{
    vec3 position;    
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};

in vec3 FragPos;
in vec3 Normal;
in vec2 TexCoords;

out vec4 color;

// Posición de la cámara
uniform vec3 viewPos;

// Parámetros de material
uniform Material material;

// Primera luz
uniform Light light;

// Segunda luz
uniform Light light2;

// Textura difusa
uniform sampler2D texture_diffuse;

void main()
{
    // ----------------------------------
    // Cálculo de vectores comunes
    // ----------------------------------
    vec3 norm   = normalize(Normal);
    vec3 viewDir = normalize(viewPos - FragPos);

    // ----------------------------------
    // ======== LUZ 1 ========
    // ----------------------------------
    // Ambient
    vec3 ambient1 = light.ambient * material.diffuse;

    // Diffuse
    vec3 lightDir1 = normalize(light.position - FragPos);
    float diff1 = max(dot(norm, lightDir1), 0.0);
    vec3 diffuse1 = light.diffuse * diff1 * material.diffuse;

    // Specular
    vec3 reflectDir1 = reflect(-lightDir1, norm);
    float spec1 = pow(max(dot(viewDir, reflectDir1), 0.0), material.shininess);
    vec3 specular1 = light.specular * (spec1 * material.specular);

    // Suma de la contribución de la luz 1
    vec3 result1 = ambient1 + diffuse1 + specular1;

    // ----------------------------------
    // ======== LUZ 2 ========
    // ----------------------------------
    // Ambient
    vec3 ambient2 = light2.ambient * material.diffuse;

    // Diffuse
    vec3 lightDir2 = normalize(light2.position - FragPos);
    float diff2 = max(dot(norm, lightDir2), 0.0);
    vec3 diffuse2 = light2.diffuse * diff2 * material.diffuse;

    // Specular
    vec3 reflectDir2 = reflect(-lightDir2, norm);
    float spec2 = pow(max(dot(viewDir, reflectDir2), 0.0), material.shininess);
    vec3 specular2 = light2.specular * (spec2 * material.specular);

    // Suma de la contribución de la luz 2
    vec3 result2 = ambient2 + diffuse2 + specular2;

    // ----------------------------------
    // Suma total de las dos luces
    // ----------------------------------
    vec3 finalLighting = result1 + result2;

    // ----------------------------------
    // Multiplicamos por la textura difusa
    // ----------------------------------
    vec4 texColor = texture(texture_diffuse, TexCoords);

    // Color final del fragmento
    color = vec4(finalLighting, 1.0) * texColor;
}