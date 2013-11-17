#include <iostream>

#include "GL/glew.h"
#include "SDL2/SDL.h"

#include "log.h"

void Log::Error(const std::string &message) {
  std::cerr << message << std::endl;
}

void Log::ErrorSDL(const std::string &tag) {
  std::cerr << tag << " error: " << SDL_GetError() << std::endl;
}

void Log::ErrorGLEW(const std::string &tag, GLenum error) {
  std::cerr << tag << " error: " << glewGetErrorString(error) << std::endl;
}

void Log::ErrorGL(const std::string &tag, GLuint error) {
  std::cerr << tag << " error: " << error << std::endl;
}
