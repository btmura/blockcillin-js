set(CMAKE_CXX_FLAGS "-std=c++11 -Wall")

find_package(GLEW REQUIRED)
find_package(OpenGL REQUIRED)

include(FindPkgConfig)
pkg_search_module(SDL2 REQUIRED sdl2)
include_directories(${SDL2_INCLUDE_DIRS})

add_library(game STATIC game.cc game.h)
add_library(glutil STATIC glutil.cc glutil.h)
add_library(ioutil STATIC ioutil.cc ioutil.h)
add_library(log STATIC log.cc log.h)
add_library(shader STATIC shader.cc shader.h)

add_executable(blockcillin main.cc)

target_link_libraries(
    blockcillin
    ${GLEW_LIBRARY}
    ${OPENGL_LIBRARY}
    ${SDL2_LIBRARIES}
    game
    glutil
    ioutil
    log
    shader)

