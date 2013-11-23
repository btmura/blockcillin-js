#ifndef BLOCKCILLIN_GAME_H_
#define BLOCKCILLIN_GAME_H_

#include <string>
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

  SDL_Window *window_ = nullptr;
  GLuint program_ = 0;
  GLuint vbo_ = 0;
  GLuint ibo_ = 0;
  GLint position_ = 0;
};

#endif // BLOCKCILLIN_GAME_H_
