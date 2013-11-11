#ifndef BLOCKCILLIN_GAME_H_
#define BLOCKCILLIN_GAME_H_

#include <iostream>

#include "GL/glew.h"
#include "SDL2/SDL.h"

class Game {
 public:
  int Run();

 private:
  bool InitWindow();
  bool InitGL();
  void Loop();
  void Render();
  void Quit();

  static void LogSDLError(const std::string &tag);
  static void LogGLEWError(const std::string &tag, const GLenum error);
  static void LogGLError(const std::string &tag, const GLuint error);

  SDL_Window *window_ = NULL;
  GLuint program_ = 0;
};

#endif // BLOCKCILLIN_GAME_H_
