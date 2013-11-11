#include "game.h"

int main(int argc, char *argv[]) {
  Game game;
  int result = game.Run();
  if (result != 0) {
    return result;
  }
  return 0;
}
